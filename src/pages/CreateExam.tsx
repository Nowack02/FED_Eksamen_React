// src/pages/CreateExam.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamForm } from '../components/ExamForm';
import { saveExam } from '../api/api';
import { Exam } from '../types';

// Tilføj en simpel wrapper-klasse for layout
const pageStyles = {
  maxWidth: '600px',
  margin: '0 auto', // Centrerer  
};

export default function CreateExam() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (examData: Omit<Exam, 'id'>) => {
    setIsSaving(true);
    setError(null);
    try {
      await saveExam(examData);
      alert('Eksamen er oprettet!');
      navigate('/');
    } catch (err) {
      setError('Der opstod en fejl under oprettelsen. Prøv igen.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={pageStyles}>
      <h2>Opret Ny Eksamen</h2>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--text-color-light)'}}>
        Udfyld nedenstående felter for at oprette en ny eksamen i systemet.
      </p>
      <ExamForm onSave={handleSave} isSaving={isSaving} />
      {error && <p style={{ color: 'var(--error-color)', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}