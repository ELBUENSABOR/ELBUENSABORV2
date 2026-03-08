const LoadingState = ({text = "Cargando..."}: { text?: string }) => (
    <div className="d-flex align-items-center justify-content-center gap-2 py-4" role="status" aria-live="polite">
        <div className="spinner-border spinner-border-sm text-danger" aria-hidden="true"/>
        <span>{text}</span>
    </div>
);

export default LoadingState;