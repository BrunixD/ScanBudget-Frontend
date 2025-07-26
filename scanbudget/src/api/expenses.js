const API_URL =  'http://localhost:8787';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro do servidor: ${response.status}`);
    }
    return response.json();
}

export async function processReceiptWithAI(token, rawText) {
    const response = await fetch(`${API_URL}/api/process-receipt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rawText })
    });
    return handleResponse(response);
}

export async function saveExpense(token, expenseData) {
    const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
    });
    return handleResponse(response);
}

export async function getExpenses(token) {
    const response = await fetch(`${API_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
}