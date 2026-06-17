import { Link } from 'react-router-dom';
import { LogOut, Stethoscope } from 'lucide-react';
import { leadDetailPath } from '../../constants/routes';
import { formatDisplayDate } from '../../hooks/useDashboard';
import { useDoctorAuth, useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import './DoctorDashboardPage.css';

export function DoctorDashboardPage() {
  const { session, handleLogout } = useDoctorAuth();
  const { queue, isLoading, error, isSubmitting, reviewLead } = useDoctorDashboard();

  if (isLoading) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-page__card">
          <p className="doctor-dashboard-page__copy">Loading doctor review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-page__card doctor-dashboard-page__card--wide">
        <div className="doctor-dashboard-page__header-row">
          <div>
            <p className="doctor-dashboard-page__eyebrow">Doctor Review</p>
            <h1>Welcome{session?.user ? `, ${session.user.displayName}` : ''}</h1>
            <p className="doctor-dashboard-page__copy">
              Review patient summaries and submit your clinical decision.
            </p>
          </div>
          <button type="button" className="doctor-dashboard-page__logout" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        {error ? <p className="doctor-dashboard-page__error">{error}</p> : null}

        {queue.length === 0 ? (
          <div className="doctor-dashboard-page__empty">
            <Stethoscope size={28} />
            <p>No patients waiting for doctor review.</p>
          </div>
        ) : (
          <ul className="doctor-dashboard-page__list">
            {queue.map((item) => (
              <li key={item.leadId} className="doctor-dashboard-page__item">
                <div className="doctor-dashboard-page__item-main">
                  <div>
                    <p className="doctor-dashboard-page__patient">{item.patientName}</p>
                    <p className="doctor-dashboard-page__meta">{item.phone}</p>
                    {item.concern ? (
                      <p className="doctor-dashboard-page__concern">{item.concern}</p>
                    ) : null}
                  </div>
                  <div className="doctor-dashboard-page__item-side">
                    <span className="doctor-dashboard-page__badge">Review Pending</span>
                    {item.requestedAt ? (
                      <time className="doctor-dashboard-page__date">
                        {formatDisplayDate(item.requestedAt)}
                      </time>
                    ) : null}
                  </div>
                </div>

                <div className="doctor-dashboard-page__actions">
                  <Link to={leadDetailPath(item.leadId)} className="doctor-dashboard-page__link">
                    Open Lead
                  </Link>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void reviewLead(item.leadId, 'approved', 'Approved for consultation')}
                    className="doctor-dashboard-page__approve"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      void reviewLead(item.leadId, 'needs_more_info', 'Need more information')
                    }
                    className="doctor-dashboard-page__more-info"
                  >
                    Need Info
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      void reviewLead(item.leadId, 'not_suitable', 'Not suitable for procedure')
                    }
                    className="doctor-dashboard-page__reject"
                  >
                    Not Suitable
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
