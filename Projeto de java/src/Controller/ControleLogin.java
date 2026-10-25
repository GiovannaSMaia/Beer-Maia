
package controller;

import dao.PessoaDAO;
import dao.Conexao;
import View.Login;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import javax.swing.JOptionPane;

public class ControleLogin {

    private Login tela1;

    public ControleLogin(Login tela1) {
        this.tela1 = tela1;
    }

    public void loginInvestidor() {

        // Recebe os dados digitados na tela
        String usuario = tela1.getInputName()
                .getText()
                .trim();

        char[] senhaDigitada = tela1.getInputSenha()
                .getPassword();

        // Validação dos campos
        if (usuario.isEmpty()) {
            JOptionPane.showMessageDialog(
                tela1,
                "Informe o nome de usuário!"
            );
            Arrays.fill(senhaDigitada, '\0');
            return;
        }

        if (senhaDigitada.length != 6) {
            JOptionPane.showMessageDialog(
                tela1,
                "A senha deve conter 6 dígitos!"
            );
            Arrays.fill(senhaDigitada, '\0');
            return;
        }

        for (char caractere : senhaDigitada) {
            if (caractere < '0' || caractere > '9') {
                JOptionPane.showMessageDialog(
                    tela1,
                    "A senha deve conter apenas números!"
                );
                Arrays.fill(senhaDigitada, '\0');
                return;
            }
        }

        // Compatibilidade temporária com o DAO atual
        String senha = new String(senhaDigitada);
        Arrays.fill(senhaDigitada, '\0');

        Conexao conexao = new Conexao();

        try (Connection conn = conexao.getConnection()) {

            PessoaDAO dao = new PessoaDAO(conn);

            boolean autenticado = dao.autenticar(usuario, senha);

            if (autenticado) {

                JOptionPane.showMessageDialog(
                    tela1,
                    "Login efetuado com sucesso!",
                    "Bem-vindo",
                    JOptionPane.INFORMATION_MESSAGE
                );

                // Futuramente abrir a tela principal
                // da Exchange neste ponto

            } else {

                JOptionPane.showMessageDialog(
                    tela1,
                    "Usuário ou senha incorretos!",
                    "Erro de login",
                    JOptionPane.ERROR_MESSAGE
                );
            }

        } catch (SQLException e) {

            JOptionPane.showMessageDialog(
                tela1,
                "Erro ao acessar o banco: " + e.getMessage(),
                "Erro de conexão",
                JOptionPane.ERROR_MESSAGE
            );
        }
    }
}
