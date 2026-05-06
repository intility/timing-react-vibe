/**
 * Error page for the app.
 * Used as a react-router error boundary
 */
export default function ErrorPage() {
  return (
    <>
      <h1 className="bf-h1">An error has occured</h1>
      <p className="bf-p">Please try refreshing the page.</p>
    </>
  );
}
