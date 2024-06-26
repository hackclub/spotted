import { createContext } from "react";

const AuthContext = createContext({ 
  token: null, 
  team: null,
  setToken: () => {},
  setTeam: () => {}
});

export default AuthContext;
