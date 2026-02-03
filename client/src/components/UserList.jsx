export default function UserList({ users, clickedToday, onClick }) {
  return (
    <div>
      <h2>Click your name</h2>
      {users.map((user) => (
        <button
          key={user}
          onClick={() => onClick(user)}
          disabled={clickedToday[user]}
          style={{ margin: "5px" }}
        >
          {user} {clickedToday[user] ? "✅" : ""}
        </button>
      ))}
    </div>
  );
}
