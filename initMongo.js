db.createUser(
  {
    user  : "userName",
    pwd   : "passWord",
    roles : [
      {
        roles : "readWrite",
        db    : "movie"
      }
    ]
  }
)
