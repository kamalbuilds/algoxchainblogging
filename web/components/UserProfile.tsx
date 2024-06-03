interface User {
  photoURL: string;
  username: string;
  displayName: string;
}

type Props = {
  user: User;
};

const UserProfile: React.FC<Props> = ({ user }) => {
  return (
    <div className="box-center">
      <img
        src={user.photoURL}
        className="card-img-center"
        alt={user.photoURL}
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
