import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Exam, Student } from '../types';
import { getExamById, getStudentsByExamId } from '../api/api';
import styles from './HistoryDetail.module.css'; 
import { formatDate } from '../utils/formatDate';

export default function HistoryDetail() {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) {
      setError("Intet eksamens-ID fundet i URL'en.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true); // Sæt loading, når vi begynder at hente
      try {
        const [examData, studentsData] = await Promise.all([
          getExamById(examId),
          getStudentsByExamId(examId)
        ]);
        setExam(examData);
        setStudents(studentsData);
      } catch (err: any) { // Brug 'any' for at kunne tilgå .message
        // GIV EN MERE SPECIFIK FEJLMEDDELELSE
        console.error("Detaljeret fejl:", err);
        setError(`Kunne ikke hente detaljer. Fejl: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [examId]);
  const averageGrade = useMemo(() => {
    const gradedStudents = students.filter(s => s.grade !== undefined && s.grade !== '');
    if (gradedStudents.length === 0) return 'N/A';
    const gradeValues = gradedStudents.map(s => parseInt(s.grade!, 10));
    const sum = gradeValues.reduce((total, grade) => total + grade, 0);
    return (sum / gradedStudents.length).toFixed(2);
  }, [students]);

  if (isLoading) return <p>Indlæser...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!exam) return <p>Kunne ikke finde den valgte eksamen.</p>;

  return (
    <div>
      <h2 className={styles.pageHeader}>Historik for: {exam.courseName}</h2>
      <p className={styles.pageSubheader}>
        <strong>Dato:</strong> {formatDate(exam.date)} | <strong>Termin:</strong> {exam.examtermin}
      </p>
      
      <div className={styles.summaryCard}>
        <h3>Gennemsnitskarakter: {averageGrade}</h3>
      </div>
      
      <h3>Eksamensresultater</h3>
      <table className={styles.resultsTable}>
        <thead>
          <tr>
            <th>Studienr.</th>
            <th>Navn</th>
            <th>Spørgsmål</th>
            <th>Karakter</th>
            <th style={{ width: '30%', textAlign: 'center'}}>Noter</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.studentNo}</td>
              <td>{student.name}</td>
              <td>{student.questionNo ?? 'N/A'}</td>
              <td>{student.grade ?? 'N/A'}</td>
              <td>{student.notes ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/history" className={styles.backLink}>← Tilbage til oversigten</Link>
    </div>
  );
}