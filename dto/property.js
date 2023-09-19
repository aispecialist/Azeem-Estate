class PropertyDTO{
    constructor(property){
        this._id = property._id;
        this.honor = property.honor;
        this.houseNumber= property.houseNumber;
        this.mohala = property.mohala;
        this.area = property.area;
        this.town = property.town;
        this.city = property.city;
        this.amountAsked = property.amountAsked;
        this.amountAdvance = property.amountAdvance;
        this.imagePath1 = property.imagePath1;
        this.imagePath2 = property.imagePath2;
        this.imagePath3 = property.imagePath3;
        this.imagePath4 = property.imagePath4;
        this.imagePath5 = property.imagePath5;
        this.imagePath6 = property.imagePath6;
        this.imagePath7 = property.imagePath7;
    }
}

module.exports = PropertyDTO;