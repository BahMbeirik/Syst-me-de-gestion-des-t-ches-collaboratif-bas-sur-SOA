/* eslint-disable eqeqeq */
import { FaNoteSticky } from "react-icons/fa6";
import { formatDate } from '../components/FormatDate';
import { TbStatusChange } from "react-icons/tb";
import { Link } from "react-router-dom";
import { GrStatusGood, GrStatusCritical } from "react-icons/gr";

const NoteCard = ({ note, user }) => {
  const statu1 = <GrStatusGood style={{ fontSize: "25px", cursor: "pointer" }} />;
  const statu2 = <TbStatusChange style={{ fontSize: "25px", cursor: "pointer" }} />;
  const statu3 = <GrStatusCritical style={{ fontSize: "25px", cursor: "pointer" }} />;
  const body = `${note.body.split(" ").slice(0, 10).join(" ")} ...`;
  const color = note.catagory === 'FINISHED' ? 'green' : note.catagory === "IN PROGRESS" ? 'blue' : 'purple';
  const statu = note.catagory === 'FINISHED' ? statu1 : note.catagory === "IN PROGRESS" ? statu2 : statu3;

  return (
    <div className="col-md-4 single-note-item all-category">
      <div className="card card-body rounded">
        <span className="side-stick" style={{ backgroundColor: color }}></span>
        <FaNoteSticky style={{ marginLeft: "auto", color: color }} />
        <h5 className="note-title text-truncate w-75 mb-0" data-noteheading="Book a Ticket for Movie">
          <Link className="T" to={`/taches/${note.id}`}>{note.title}</Link> {/* تعديل الرابط لتوجيه المستخدم إلى صفحة التفاصيل */}
        </h5>
        <p className="note-date font-12 text-muted">{formatDate(note.updated_at)}</p>
        <div className="note-content">
          <p className="note-inner-content text-muted" data-notecontent="Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.">{body}</p>
        </div>
        <div className="d-flex align-items-center">
          <Link to={`/taches/${note.id}`}>
            <span className="mr-1" style={{ color: color }}>{statu}</span>
          </Link>
          <small className="text-muted">{note.catagory}</small>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
