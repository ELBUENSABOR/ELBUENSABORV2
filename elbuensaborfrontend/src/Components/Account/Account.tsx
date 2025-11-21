import React, { useEffect } from "react";
import { useUser } from "../../contexts/UsuarioContext";
import { getUserService } from "../../services/userService";

const Account = () => {
  const { user } = useUser();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  const getUser = async () => {
    const resp = await getUserService(user?.userId || "");
    console.log("resp", resp);
  };

  useEffect(() => {
    getUser();
  }, [user]);

  
  return (
    <div>
      <h1>Mi perfil:</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" />
          <input type="text" name="apellido" placeholder="Apellido" />
          <input type="text" name="email" placeholder="Email" />
          <input type="text" name="username" placeholder="Nombre de usuario" />
          <input type="text" name="telefono" placeholder="Teléfono" />
          <input type="text" name="calle" placeholder="Calle" />
          <input type="text" name="numero" placeholder="Número" />
          <input
            type="number"
            name="codigoPostal"
            placeholder="Código postal"
          />
          <input type="number" name="localidad" placeholder="Localidad" />
        </form>
        <button type="submit">Guardar</button>
      </div>
    </div>
  );
};

export default Account;
