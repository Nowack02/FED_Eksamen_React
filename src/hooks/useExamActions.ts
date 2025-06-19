import { useNavigate } from 'react-router-dom';
import { removeExam as apiRemoveExam } from '../api/api';

interface UseExamActionsProps {
    onExamDeleted?: (examId: string) => void;
}

export const useExamActions = ({ onExamDeleted }: UseExamActionsProps = {}) => {
    const navigate = useNavigate();

    const deleteExam = async (examId: string) => {
        if (!window.confirm('Er du sikker på, at du vil slette denne eksamen og ALLE tilknyttede studerende? Handlingen kan ikke fortrydes.')) {
            return;
        }

        try {
            await apiRemoveExam(examId);
            
            if (onExamDeleted) {
                onExamDeleted(examId);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Fejl ved sletning af eksamen", err);
            alert("Der skete en fejl under sletningen.");
        }
    };

    // Returner de funktioner, som komponenterne kan bruge
    return { deleteExam };
};