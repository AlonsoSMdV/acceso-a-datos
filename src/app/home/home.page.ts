import { Component } from '@angular/core';
import { PeopleService } from '../core/services/people.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public peopleSvc:PeopleService
  ) {}
    createPerson(){
      this.peopleSvc.addPerson({
        name: "Alonso",
        surname: "Sánchez Moreno de Vega", 
        age: 20
      }).subscribe({
          next:(value)=>{
            console.log("Persona añadida corréctamente");
            console.log(value);
          },
      });
    }
    deletePerson(){
      this.deletePerson();
    }


}
