const UsersListLoading = () => {
  const styles = {
    borderRadius: "0.475rem",
    boxShadow: "0 0 50px 0 rgb(82 63 105 / 15%)",
    backgroundColor: "#fff",
    color: "#7e8299",
    fontWeight: "500",
    width: "auto",
    margin: "0",
    padding: "1rem 2rem",
    left: "50%",
    transform: "translateX(-50%)",
  }

  return (
    <tr>
      <td style={{ padding: "50px 0" }}>
        <div style={{ ...styles, position: "absolute", textAlign: "center" }}>
          Yükleniyor...
        </div>
      </td>
    </tr>
  )
}

export { UsersListLoading }
