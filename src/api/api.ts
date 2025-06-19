import { Exam, Student } from '../types';

const API_BASE_URL = 'http://localhost:4001';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} ${error}`);
    }
    return response.json();
}

// Hent alle eksamener
export const getExams = async (): Promise<Exam[]> => {
    const response = await fetch(`${API_BASE_URL}/exams`);
    return handleResponse(response);
};

// Hent en specifik eksamen via ID
export const getExamById = async (id: string): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`);
    return handleResponse(response);
}

// Gem en ny eksamen
export const saveExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
    });
    return handleResponse(response);
};

// Hent studerende for en specifik eksamen
export const getStudentsByExamId = async (examId: string): Promise<Student[]> => {
    const response = await fetch(`${API_BASE_URL}/students?examId=${examId}`);
    return handleResponse(response);
}

// Tilføj en ny studerende til en eksamen
export const addStudentToExam = async (studentData: Omit<Student, 'id' | 'examId'>, examId: string): Promise<Student> => {
    const dataToSave = { ...studentData, examId };
    const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
    });
    return handleResponse(response);
}

// Opdater en studerendes oplysninger (efter eksamination)
export const updateStudent = async (studentId: string, data: Partial<Student>): Promise<Student> => {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

// Slet en studerende baseret på ID
export const removeStudent = async (studentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} ${error}`);
    }
};

// Slet en eksamen og alle tilknyttede studerende
export const removeExam = async (examId: string): Promise<void> => {
    const studentsToDelete = await getStudentsByExamId(examId);

    const deleteStudentPromises = studentsToDelete.map(student => 
        fetch(`${API_BASE_URL}/students/${student.id}`, { method: 'DELETE' })
    );

    const deleteExamPromise = fetch(`${API_BASE_URL}/exams/${examId}`, { method: 'DELETE' });

    const allPromises = [...deleteStudentPromises, deleteExamPromise];
    const responses = await Promise.all(allPromises);

    for (const response of responses) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error during cascade delete: ${response.status} ${error}`);
        }
    }
};

// Marker en eksamen som afsluttet
export const markExamAsCompleted = async (examId: string): Promise<Exam> => {
    const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: true }),
    });
    return handleResponse(response);
};