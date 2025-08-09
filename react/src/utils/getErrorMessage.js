export function getErrorMessage(error) {
  if (!error) return 'Произошла ошибка';
  const data = error?.response?.data;
  if (!data) return error?.message || 'Произошла ошибка';
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  if (typeof data?.message === 'string') return data.message;
  return 'Произошла ошибка';
}

export default getErrorMessage;
