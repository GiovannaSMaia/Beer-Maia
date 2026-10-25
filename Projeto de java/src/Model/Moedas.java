/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author giovanna
 */
public class Moedas {
    
    private Carteira carteira;
    
    public Moedas(Carteira carteira) {
    this.carteira = carteira;
}

    public double getQtdBitcoin() {
        return carteira.getQtdBitcoin();
    }

    public double getQtdRipple() {
        return carteira.getQtdRipple();
    }

    public double getQtdEthereum() {
        return  carteira.getQtdEthereum();
    }
    
    private double cotacaoEmDolar;

    public double getCotacaoEmDolar() {
        return cotacaoEmDolar;
    }

    public void setCotacaoEmDolar(double cotacaoEmDolar) {
        this.cotacaoEmDolar = cotacaoEmDolar;
    }
    
    private double cotacaoEmReal;

    public double getCotacaoEmReal() {
        return cotacaoEmReal;
    }

    public void setCotacaoEmReal(double cotacaoEmReal) {
        this.cotacaoEmReal = cotacaoEmReal;
    }
    
     public Moedas(double cotacaoEmDolar, double cotacaoEmReal) {
        this.cotacaoEmDolar = cotacaoEmDolar;
        this.cotacaoEmReal = cotacaoEmReal;
    }
     
    public Moedas(double cotacaoEmDolar) {
        this.cotacaoEmDolar = cotacaoEmDolar;
    }
    
    private double ripple;
    private double ethereum;
    private double bitcoin;
    private double real;

    public double getRipple() {
        return ripple;
    }

    public void setRipple(double ripple) {
        this.ripple = ripple;
    }

    public double getEthereum() {
        return ethereum;
    }

    public void setEthereum(double ethereum) {
        this.ethereum = ethereum;
    }

    public double getBitcoin() {
        return bitcoin;
    }

    public void setBitcoin(double bitcoin) {
        this.bitcoin = bitcoin;
    }

    public double getReal() {
        return real;
    }

    public void setReal(double real) {
        this.real = real;
    }
    
}
