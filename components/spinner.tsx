export default function Spinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      {message && <p className="text-sm text-slate-600 font-medium">{message}</p>}
    </div>
  )
}
