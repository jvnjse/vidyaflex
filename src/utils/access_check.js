function accessCheck() {
  const accessToken = localStorage.getItem("access");
  return accessToken ? true : false;
}

function roleCheck() {
  const role = localStorage.getItem("role");
  console.log(role);
  return role === "false" ? true : false;
}

export { accessCheck, roleCheck };
