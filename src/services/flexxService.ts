const API_BASE = '/api';

export const flexService = {
  fetchTableData: async () => {
    const res = await fetch(`${API_BASE}/flexx-table`);

    if (!res.ok) { throw new Error(`Network response wass not ok: ${res.status}`) };

return res.json();
  },
  fetchTopCardsData: async () => {
    const res = await fetch(`${API_BASE}/top-cards`);

    if (!res.ok) { throw new Error(`Network response was not ok: ${res.status}`) };

    return res.json();
  }
}
