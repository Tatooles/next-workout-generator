export default function Response({
  answer,
  loading,
}: {
  answer: string;
  loading: boolean;
}) {
  return (
    <div className="mt-4 w-11/12 rounded-md border-2 p-5 whitespace-pre-line">
      {!loading && answer}
      {loading && <div>Loading...</div>}
    </div>
  );
}
