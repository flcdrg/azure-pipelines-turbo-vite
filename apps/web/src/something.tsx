export function Something() {
  const message = import.meta.env.VITE_SOME_MESSAGE;
  return <div>{message}</div>;
}
