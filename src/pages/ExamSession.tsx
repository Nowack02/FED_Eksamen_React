import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Exam, Student } from '../types';
import { getExamById, getStudentsByExamId, updateStudent, markExamAsCompleted } from '../api/api';
import { Timer } from '../components/Timer';
import styles from './ExamSession.module.css';


type ExamPhase = 'loading' | 'error' | 'readyToDraw' | 'questionDrawn' | 'inProgress' | 'finished' | 'examCompleted';

export default function ExamSession() {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const [exam, setExam] = useState<Exam | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [phase, setPhase] = useState<ExamPhase>('loading');
    const [error, setError] = useState<string | null>(null);
    const [drawnQuestion, setDrawnQuestion] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [grade, setGrade] = useState('');
    const [timeSpent, setTimeSpent] = useState(0);

    useEffect(() => {
        if (!examId) {
            setError("Intet eksamens-ID fundet i URL'en.");
            setPhase('error');
            return;
        }

        const fetchData = async () => {
            setPhase('loading');
            try {
                const [examData, studentsData] = await Promise.all([
                    getExamById(examId),
                    getStudentsByExamId(examId)
                ]);

                if (studentsData.length === 0) {
                    setError("Der er ingen studerende tilmeldt denne eksamen.");
                    setPhase('error');
                } else {
                    setExam(examData);
                    setStudents(studentsData);
                    setPhase('readyToDraw');
                }
            } catch (err) {
                setError("Kunne ikke indlæse eksamensdata. Tjek om serveren kører, og om eksamens-ID'et er korrekt.");
                setPhase('error');
                console.error(err);
            }
        };

        fetchData();
    }, [examId]);

    const currentStudent = students[currentStudentIndex];

    const handleDrawQuestion = () => {
        if (!exam) return;
        const question = Math.floor(Math.random() * exam.numberOfQuestions) + 1;
        setDrawnQuestion(question);
        setPhase('questionDrawn');
    };

    const handleStartExam = () => {
        setPhase('inProgress');
    };

    const handleEndExam = () => {
        setPhase('finished');
    };

    const handleSaveAndNext = async () => {
        if (!currentStudent || !exam) return;

        const updatedData: Partial<Student> = {
            questionNo: drawnQuestion ?? undefined,
            notes: notes,
            grade: grade,
            actualExamTimeMinutes: Math.round(timeSpent / 60)
        };

        await updateStudent(currentStudent.id, updatedData);

        // Tjek om der er flere studerende
        if (currentStudentIndex < students.length - 1) {
            setCurrentStudentIndex(prev => prev + 1);
            
            setPhase('readyToDraw');
            setDrawnQuestion(null);
            setNotes('');
            setGrade('');
            setTimeSpent(0);
        } else {
            // Ingen flere studerende, afslut eksamen
            await markExamAsCompleted(exam.id);
            setPhase('examCompleted');
        }
    };

    if (phase === 'loading') return <p>Indlæser session...</p>;
    if (phase === 'error') {
      return (
        <div className={`${styles.examCard} ${styles.finalMessage}`}>
            <h2>Der opstod en fejl</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className={`${styles.button} ${styles.primaryButton}`}>Tilbage til forsiden</button>
        </div>
      );
    }
        if (phase === 'examCompleted') {
        if (!exam) return <p>Eksamen er afsluttet.</p>;

        return (
            <div className={`${styles.examCard} ${styles.finalMessage}`}>
                <h2>Eksamen er Gennemført!</h2>
                <p>
                    Alle studerende er blevet eksamineret, og eksamenen er nu arkiveret i historikken.
                </p>
                <div className={styles.actionsContainer}>
                    <button onClick={() => navigate('/')} className={`${styles.button} ${styles.secondaryButton}`}>
                        Tilbage til Forsiden
                    </button>
                    <Link to={`/history/${exam.id}`} className={`${styles.button} ${styles.primaryButton}`}>
                        Se Detaljeret Historik
                    </Link>
                </div>
            </div>
        );
    }

    if (!exam || !currentStudent) {
      console.error("Render-blokering: Forsøgte at rendere uden fuld data, selvom fasen ikke var 'loading' eller 'error'.");
      return <p>Venter på data...</p>;
    }

    return (
        <div className={styles.sessionContainer}>
            <h1 className={styles.pageHeader}>{exam.courseName}</h1>
            <div className={styles.examCard}>
                <div className={styles.studentInfo}>
                    <h2>{currentStudent.name}</h2>
                    <p>Studerende {currentStudentIndex + 1} af {students.length} ({currentStudent.studentNo})</p>
                </div>

                <div className={styles.actionArea}>
                    {phase === 'readyToDraw' && (
                        <button onClick={handleDrawQuestion} className={`${styles.button} ${styles.primaryButton}`}>Træk Spørgsmål</button>
                    )}
                    {phase === 'questionDrawn' && (
                        <div>
                            <p className={styles.drawnQuestion}>Trukket spørgsmål: {drawnQuestion}</p>
                            <button onClick={handleStartExam} className={`${styles.button} ${styles.successButton}`}>Start Eksamination</button>
                        </div>
                    )}
                    {phase === 'inProgress' && (
                        <Timer
                            initialMinutes={exam.examDurationMinutes}
                            isRunning={true}
                            onTimerStop={(seconds) => {
                                setTimeSpent(seconds);
                                setPhase('finished');
                            }}
                        />
                    )}
                </div>

                {(phase === 'inProgress' || phase === 'finished') && (
                    <textarea
                        className={styles.notesTextarea}
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Indtast noter til eksaminationen her..."
                    />
                )}
                 {phase === 'inProgress' && <button onClick={handleEndExam} className={`${styles.button} ${styles.dangerButton}`}>Slut Eksamination</button>}

                {phase === 'finished' && (
                    <div className={styles.gradingSection}>
                        <p>Eksamination stoppet. Faktisk tid: {Math.round(timeSpent / 60)} minutter.</p>
                        <div>
                            <label htmlFor="grade-select">Karakter:</label>
                            <select id="grade-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                                <option value="">Vælg karakter</option>
                                {['-3', '00', '02', '4', '7', '10', '12'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <button onClick={handleSaveAndNext} disabled={!grade} className={`${styles.button} ${styles.successButton}`}>
                            {currentStudentIndex < students.length - 1 ? 'Gem og Næste Studerende' : 'Gem og Afslut Eksamen'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}