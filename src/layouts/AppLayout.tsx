type AppLayoutProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  children: React.ReactNode;
};
const AppLayout = ({ title, subtitle, showBack, children }: AppLayoutProps) => {
  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-start pt-5">
      <div
        className="w-100 bg-white shadow-sm"
        style={{
          maxWidth: 430,
          borderRadius: 24,
          overflow: 'hidden', // 🔴 important
        }}
      >
        {/* 🔴 RED HEADER */}
        <div
          className="bg-danger text-white position-relative d-flex flex-column justify-content-center"
          style={{
            height: 220,                 // 🔥 height badhai
            borderBottomLeftRadius: 24,  // 🔥 bottom curve
            borderBottomRightRadius: 24,
          }}
        >
          {showBack && (
            <span className="position-absolute start-0 top-50 translate-middle-y ms-3 fs-4">
              ←
            </span>
          )}

          <div className="text-center">
            <div
              className="mx-auto mb-3"
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#9b0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span className="bg-white rounded-circle" style={{ width: 8, height: 8 }} />
              <span className="border border-white rounded-circle" style={{ width: 10, height: 10 }} />
              <span className="border border-white rounded-circle" style={{ width: 12, height: 12 }} />
            </div>

            <h4 className="fw-bold mb-1">{title}</h4>
            {subtitle && (
              <p className="text-white-50 mb-0">{subtitle}</p>
            )}
          </div>
        </div>

        {/* ⚪ CONTENT */}
        <div className="p-4 px-3 px-md-4">
          {children}
        </div>
      </div>
    </div>
  );
};


export default AppLayout;
