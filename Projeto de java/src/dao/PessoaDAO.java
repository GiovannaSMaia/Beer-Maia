
package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import model.Pessoa;

public class PessoaDAO {

    private Connection conn;

    public PessoaDAO(Connection conn) {
        this.conn = conn;
    }

    // Consultar pessoa pelo CPF
    public ResultSet consultar(Pessoa pessoa) throws SQLException {

        String sql = "SELECT * FROM public.cadastro WHERE cpf = ?";

        PreparedStatement statement = conn.prepareStatement(sql);

        statement.setString(1, pessoa.getCpf());

        return statement.executeQuery();
    }

    // Inserir novo cadastro
    public int inserir(Pessoa pessoa) throws SQLException {

        String sql = "INSERT INTO public.cadastro "
                   + "(nome, cpf, usuario_de_login, senha) "
                   + "VALUES (?, ?, ?, ?) RETURNING id";

        try (PreparedStatement statement = conn.prepareStatement(sql)) {

            statement.setString(1, pessoa.getNome());
            statement.setString(2, pessoa.getCpf());
            statement.setString(3, pessoa.getUsuarioDeLogin());
            statement.setString(4, pessoa.getSenha());

            try (ResultSet resultado = statement.executeQuery()) {

                if (resultado.next()) {
                    return resultado.getInt("id");
                }
            }
        }

        throw new SQLException(
            "Não foi possível recuperar o ID cadastrado."
        );
    }

    // Autenticar usuário e senha
    public boolean autenticar(String usuario, String senha)
            throws SQLException {

        String sql = "SELECT id FROM public.cadastro "
                   + "WHERE LOWER(usuario_de_login) = LOWER(?) "
                   + "AND senha = ?";

        try (PreparedStatement statement = conn.prepareStatement(sql)) {

            statement.setString(1, usuario);
            statement.setString(2, senha);

            try (ResultSet resultado = statement.executeQuery()) {
                return resultado.next();
            }
        }
    }

    // Atualizar senha pelo CPF
    public void atualizar(Pessoa pessoa) throws SQLException {

        String sql = "UPDATE public.cadastro "
                   + "SET senha = ? WHERE cpf = ?";

        try (PreparedStatement statement = conn.prepareStatement(sql)) {

            statement.setString(1, pessoa.getSenha());
            statement.setString(2, pessoa.getCpf());

            statement.executeUpdate();
        }
    }

    // Remover cadastro pelo CPF
    public void remover(Pessoa pessoa) throws SQLException {

        String sql = "DELETE FROM public.cadastro WHERE cpf = ?";

        try (PreparedStatement statement = conn.prepareStatement(sql)) {

            statement.setString(1, pessoa.getCpf());

            statement.executeUpdate();
        }
    }
}
