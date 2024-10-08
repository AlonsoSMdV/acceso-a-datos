import { Injectable } from '@angular/core';
import { DataService } from '../interfaces/data-service';
import { Person } from '../interfaces/person';
import { Observable, BehaviorSubject } from 'rxjs';
import { Model } from '../interfaces/model';


export abstract class generic<T>{
    public abstract method1<T>():void;
}
export class DataInMemoryService<T extends Model> extends DataService<T>{
    
    


    constructor(){
        super();
        console.log("DataInMemoryService created");
    }

   // Método privado para generar un código alfanumérico aleatorio de 10 caracteres
    private generarCodigoAlfanumerico(): string {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let codigo = "";
        for (let i = 0; i < 10; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres[indiceAleatorio];
        }
        return codigo;
    }

    // Obtener la fecha actual en formato ISO YYYY-MM_DDT(T es separador entre dias y horas)HH:mm:ssZ(zona horaria)
    // Esto asegura que la fecha se guarde en un formato estándar que sea entendido por diferentes sistemas.
    private obtenerFechaActual(): string {
        return new Date().toISOString().split('.')[0] + 'Z';
    }

    // Método para crear un nuevo registro.
    // Sobrescribe el método 'create' de DataService y devuelve un Observable con el nuevo registro.
    public override create(value: T): Observable<T> {
        return new Observable((observer) => {
            value.id = this.generarCodigoAlfanumerico();//Id aleatorio
            value.createdAt = this.obtenerFechaActual();//Fecha actual
            const _records = this._records.value;//Obtener array actual de registro desde BehaviorSubject
            this._records.next([..._records, value]);//Agrega nuevo registro a la lista
            observer.next(value);//Envía el registro nuevo
            observer.complete();//Completa el observable
        });
    }

    // Método para obtener todos los registros almacenados.
    // Devuelve un Observable que emite los valores actuales del BehaviorSubject (la lista de registros).
    public override requestAll(): Observable<T[]> {
        return this._records.asObservable(); // Devuelve el BehaviorSubject como un Observable para tener los valores actuales
    }

    // Método para obtener un registro por su ID.
    // Devuelve un Observable que emitirá el registro si se encuentra, o `null` si no existe.
    public override requestById(id: string): Observable<T | null> {
        return new Observable((observer) => {
            const record = this._records.value.find(item => item.id === id) || null;//Busca el registro mediante el id
            observer.next(record);//Emite el registro encontrado o null
            observer.complete();//Completa el observable
        });
    }

    // Método para actualizar un registro por su ID.
    // Devuelve un Observable que emitirá el registro actualizado o `null` si no se encuentra.
    public override update(id: string, value: T): Observable<T | null> {
        return new Observable((observer) => {
            const _records = this._records.value;
            const index = _records.findIndex(item => item.id === id);//Encuentra el id del registro
            if (index !== -1) {//Si existe
                value.modifiedAt = this.obtenerFechaActual();//Modifica los datos y añade fecha de modificación
                _records[index] = { ..._records[index], ...value };//Crea registro nuevo con los datos nuevos y lo remplaza por los antiguos
                this._records.next([..._records]);//Emite el array actualizado
                observer.next(_records[index]);//Envía el registro actualizado
            } else {//No existe
                observer.next(null);//Emite null si no se encuentra el registro
            }
            observer.complete();//Completa el observable
        });
    }

    // Método para eliminar un registro por su ID.
    // Devuelve un Observable que emitirá el registro eliminado o `null` si no se encuentra.
    public override delete(id: string): Observable<T | null> {
        return new Observable((observer) => {
            const _records = this._records.value;
            const index = _records.findIndex(item => item.id === id);//Encuentra el id del registro
            if (index !== -1) {//Si existe
                const deletedRecord = _records.splice(index, 1)[0];//Elimina el registro del array
                this._records.next([..._records]);//Emite el array actualizado
                observer.next(deletedRecord);//Envía el registro actualizado
            } else {//No existe
                observer.next(null);//Emite null si no se encuentra el registro
            }
            observer.complete();//Completa el observable
        });
    }
}

