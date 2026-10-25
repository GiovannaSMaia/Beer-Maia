
package controller;

import dao.PessoaDAO;
import dao.Conexao;
import model.Investidor;
import View.Cadastrar;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;
import javax.swing.JOptionPane;

public class ControleCadastro {

    private Cadastrar tela2;

    public ControleCadastro(Cadastrar tela2) {
        this.tela2 = tela2;
    }

    public void salvarPessoa() {

        // Recebe os dados da interface
        String nome = tela2.getInputNameCadastro().getText().trim();
        String senha = tela2.getInputSenhaCadastro().getText().trim();
        String cpf = tela2.getInputCpfCadastro().getText().trim();

        String usuario = tela2.getInputUsuarioCadastro()
                .getText()
                .trim()
                .toLowerCase(Locale.ROOT);

        // Validação do nome
        if (nome.isEmpty()) {
            JOptionPane.showMessageDialog(
                tela2,
                "Informe o nome!"
            );
            return;
        }

        // Validação do CPF
        if (!cpf.matches("\\d{11}")) {
            JOptionPane.showMessageDialog(
                tela2,
                "O CPF deve conter 11 dígitos!"
            );
            return;
        }

        // Validação da senha
        if (!senha.matches("\\d{6}")) {
            JOptionPane.showMessageDialog(
                tela2,
                "A senha deve conter 6 dígitos!"
            );
            return;
        }

        // Validação do usuário
        if (!usuario.matches("[a-z0-9_]{3,30}")) {
            JOptionPane.showMessageDialog(
                tela2,
                "O usuário deve ter de 3 a 30 caracteres,\n"
                + "utilizando letras, números ou underline."
            );
            return;
        }

        // Cria o investidor
        Investidor investidor = new Investidor(nome, cpf, senha);

        // Define o usuário de login
        investidor.setUsuarioDeLogin(usuario);

        // Conexão com o PostgreSQL
        Conexao conexao = new Conexao();

        try (Connection conn = conexao.getConnection()) {

            PessoaDAO dao = new PessoaDAO(conn);

            // Insere no banco e recupera o ID
            int idGerado = dao.inserir(investidor);

            // Atribui o ID ao investidor
            investidor.atribuirId(idGerado);

        } catch (SQLException ex) {

            if ("23505".equals(ex.getSQLState())) {
                JOptionPane.showMessageDialog(
                    tela2,
                    "Este CPF ou nome de usuário já está cadastrado!",
                    "Cadastro duplicado",
                    JOptionPane.WARNING_MESSAGE
                );
            } else {
                JOptionPane.showMessageDialog(
                    tela2,
                    "Erro ao cadastrar: " + ex.getMessage(),
                    "Erro",
                    JOptionPane.ERROR_MESSAGE
                );
            }

            // Não abre o Login se ocorrer erro
            return;
        }

        // Só chega aqui quando o cadastro foi salvo
        JOptionPane.showMessageDialog(
            tela2,
            "Usuário cadastrado com sucesso!\n"
            + "ID: " + investidor.getId(),
            "Cadastro realizado",
            JOptionPane.INFORMATION_MESSAGE
        );

        // Abre o Login após o cadastro bem-sucedido
        tela2.abrirTelaLogin();
    }
}
