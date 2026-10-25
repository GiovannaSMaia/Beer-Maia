
package model;

public class Carteira {

    // Relação com o investidor
    private Investidor investidor;
    private Moedas moedas;

    // Quantidades de criptomoedas
    private double qtdEthereum;
    private double qtdBitcoin;
    private double qtdRipple;

    // Construtor
    public Carteira(Investidor investidor) {
        this.investidor = investidor;
        this.moedas = new Moedas(this);
    }

    // Dados do proprietário da carteira
    public Integer getId() {
        return investidor.getId();
    }

    public String getNome() {
        return investidor.getNome();
    }

    public double getSaldoEmReais() {
        return investidor.getSaldoEmReais();
    }

    // Quantidade de Ethereum
    public double getQtdEthereum() {
        return qtdEthereum;
    }

    public void setQtdEthereum(double qtdEthereum) {
        this.qtdEthereum = qtdEthereum;
    }

    // Quantidade de Bitcoin
    public double getQtdBitcoin() {
        return qtdBitcoin;
    }

    public void setQtdBitcoin(double qtdBitcoin) {
        this.qtdBitcoin = qtdBitcoin;
    }

    // Quantidade de Ripple
    public double getQtdRipple() {
        return qtdRipple;
    }

    public void setQtdRipple(double qtdRipple) {
        this.qtdRipple = qtdRipple;
    }
}
