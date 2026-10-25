
package View;

import java.awt.Graphics;
import java.awt.Image;
import javax.swing.ImageIcon;
import javax.swing.JPanel;

public class PainelDeFundo extends JPanel {

    private Image imagem;

    public PainelDeFundo() {
        this("/View/imagens/fundologin.png");
    }

    public PainelDeFundo(String caminho) {
        java.net.URL recurso = getClass().getResource(caminho);

        if (recurso != null) {
            imagem = new ImageIcon(recurso).getImage();
        } else {
            System.err.println("Imagem não encontrada: " + caminho);
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        if (imagem != null) {
            g.drawImage(
                imagem,
                0,
                0,
                getWidth(),
                getHeight(),
                this
            );
        }
    }
}
