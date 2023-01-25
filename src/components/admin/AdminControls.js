import '../../styles/AdminControls.scss'

import { Link } from "react-router-dom";
export default function AdminControls() {
  return (
    <div className='AdminControls'>
      <h1>Admin controls</h1>
      <Link>Add a new bird to the database</Link>
      <Link>Edit an existing bird in the database:</Link><select name="" id="">
        <option value=""></option>
      </select>
    </div>
  );
}
