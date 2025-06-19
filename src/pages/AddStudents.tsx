// src/pages/AddStudents.tsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Exam, Student } from '../types';
import { getExamById, getStudentsByExamId, addStudentToExam, removeStudent, removeExam} from '../api/api'; // Tilføj removeStudent
import { StudentForm } from '../components/StudentForm';
import styles from './AddStudents.module.css';

export default function AddStudents() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Din eksisterende useEffect-logik er uændret
    if (!examId) {
      setError("Intet eksamens-ID fundet i URL'en.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [examData, studentsData] = await Promise.all([
          getExamById(examId),
          getStudentsByExamId(examId)
        ]);
        setExam(examData);
        setStudents(studentsData);
      } catch (err) {
        setError('Kunne ikke hente data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  const handleAddStudent = async (name: string, studentNo: string) => {
    // ... uændret ...
    if (!examId) return;
    setIsSaving(true);
    try {
        await addStudentToExam({ name, studentNo }, examId);
        const studentsData = await getStudentsByExamId(examId);
        setStudents(studentsData);
    } catch (err) {
        alert("Der skete en fejl ved tilføjelse.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleRemoveExam = async () => {
    if (!exam) return;
    // God UX: Spørg altid om bekræftelse ved sletning
    if (!window.confirm('Er du sikker på, at du vil slette denne eksamen?'))
      return;

     try {
      await removeExam(exam.id);
      alert('Eksamen er slettet.');
      navigate('/'); // Send brugeren tilbage til forsiden
    } catch (err) {
      console.error("Fejl ved sletning af eksamen", err);
      alert("Der skete en fejl under sletningen.");
    }
  };   

  // NY FUNKTION til at fjerne en studerende
  const handleRemoveStudent = async (studentId: string) => {
    // God UX: Spørg altid om bekræftelse ved sletning
    if (!window.confirm('Er du sikker på, at du vil fjerne denne studerende?')) {
      return;
    }

    try {
      await removeStudent(studentId);
      // Opdater UI'et ved at fjerne den studerende fra vores lokale state
      // Dette er hurtigere end at gen-hente hele listen fra serveren
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
    } catch (err) {
      console.error("Fejl ved sletning af studerende", err);
      alert("Der skete en fejl under sletningen.");
    }
  };

  if (isLoading) return <p>Indlæser...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!exam) return <p>Eksamen blev ikke fundet.</p>

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>Tilføj Studerende til: {exam.courseName}</h2>
        <p>{exam.examtermin} - afholdes den {new Date(exam.date).toLocaleDateString('da-DK')}</p>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.formContainer}>
          <StudentForm onSave={handleAddStudent} isSaving={isSaving} />
        </div>

        <div className={styles.studentListContainer}>
          <h3>Tilmeldte Studerende ({students.length})</h3>
          {students.length > 0 ? (
            <ol className={styles.studentList}>
              {/* Opdateret liste til at inkludere en "Fjern"-knap */}
              {students.map(s => (
                <li key={s.id}>
                  <span>{s.name} ({s.studentNo})</span>
                  <button onClick={() => handleRemoveStudent(s.id)} className={styles.removeButton}>
                    Fjern
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p>Ingen studerende er tilføjet endnu.</p>
          )}
        </div>
      </div>
      
      <div className={styles.actions}>
        <Link to={`/exam/${exam.id}/session`} className={styles.actionButton}>
          Gå til Eksamen
        </Link>
        <button onClick={handleRemoveExam} className={styles.dangerButton}>
          Slet Eksamen
        </button>
      </div>
    </div>
  );
}