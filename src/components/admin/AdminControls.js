import { Link } from "react-router-dom";
export default function AdminControls() {
  return (
    <>
      <p>Admin controls</p>
      <Link>Add a new bird to the database</Link>
      <Link>Edit an existing bird in the database</Link>
      <Link></Link>
    </>
  );
}
