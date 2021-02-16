export async function catcher<T>(fn: () => any): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    let status, message;

    if (error.response) {
      status = error.response.status;
      message = error.response.message;
    } else {
      status = 500;
      message = 'Something went wrong';
    }

    window.location.href = `/error?status=${status}&message=${encodeURIComponent(
      message
    )}`;
  }
}
