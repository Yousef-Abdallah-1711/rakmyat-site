import { teamMembers, teamSocialLinks } from "@/content/team";

export function TeamGrid() {
  return (
    <div className="row">
      {teamMembers.map((member, index) => (
        <div className="col-lg-3 col-sm-6" key={member.name}>
          <div
            className={`team-card${index < teamMembers.length - 1 ? " mb-30 mb-lg-0" : ""} style-6`}
          >
            <div className="img img-cover">
              <img src={member.image} alt="" />
              <div className="social-icons">
                {teamSocialLinks.map((network) => (
                  <a href="#" key={network}>
                    <i className={`fab fa-${network}`} />
                  </a>
                ))}
              </div>
            </div>
            <div className="info">
              <a className="d-block" href="#">
                <h6>{member.name}</h6>
              </a>
              <small>{member.role}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
