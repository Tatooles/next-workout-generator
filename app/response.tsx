export default function Response({
  answer,
  loading,
}: {
  answer: string;
  loading: boolean;
}) {
  return (
    <div className="mt-4 w-11/12 whitespace-pre-line rounded-md border-2 p-5">
      {!loading && answer}
      {loading && <div>Loading...</div>}
    </div>
  );
}
