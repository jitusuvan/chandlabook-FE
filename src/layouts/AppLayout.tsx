type AppLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: React.ReactNode;
};

const AppLayout = ({ title, subtitle, showBack, children }: AppLayoutProps) => {
  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center mt-5">
      <div className="w-100" style={{ maxWidth: 430 }}>
        
        {/* 🔴 RED HEADER */}
        <div className="bg-danger text-white rounded-bottom-4 rounded-top-4 p-4 position-relative">
          {showBack && (
            <span className="position-absolute start-0 top-50 translate-middle-y ms-3 fs-4">
              ←
            </span>
          )}

          <h4 className="fw-bold mb-1 text-center">{title}</h4>
          {subtitle && (
            <p className="text-white-50 text-center mb-0">{subtitle}</p>
          )}
        </div>

        {/* ⚪ WHITE CONTENT */}
        <div className="bg-white rounded-4 shadow-sm p-4 mt-3 px-3 px-md-4">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AppLayout;
