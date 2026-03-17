/**
 * Repräsentiert die Geliebte (Durango), die am Ende des Spiels erscheint,
 * nachdem der Endboss besiegt wurde.
 */
class Durango extends MovableObject {
  y = 150;
  width = 150;
  height = 250;

  constructor(x) {
    super();
    this.loadImage("img/5_background/laputa.png");
    this.x = x;
    this.applyGravity();
  }
}
