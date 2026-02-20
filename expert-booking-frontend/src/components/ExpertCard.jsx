import { Link } from "react-router-dom";

export default function ExpertCard({ expert }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        
        <div>
          <div className="cardTitle">{expert.name}</div>

          <div style={{ marginTop: 4 }}>
            <span className="badge badgePurple">
              {expert.category}
            </span>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            Experience: {expert.experienceYears} yrs
          </div>

          <div className="muted">
            ⭐ Rating: {expert.rating}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={`/experts/${expert._id}`}>
            <button className="btn btnPrimary">View</button>
          </Link>
        </div>

      </div>
    </div>
  );
}