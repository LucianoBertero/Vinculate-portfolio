import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  // public timer$: Observable<number>;
  // private stopTimer$ = new Subject<void>();
  // constructor(private router: Router) {}
  // //se crea un observable que controle el tiempo en sesion
  // startTimer(timeout: number): void {
  //   this.timer$ = timer(timeout).pipe(takeUntil(this.stopTimer$));
  //   this.timer$.subscribe(() => {
  //     localStorage.removeItem('token');
  //     this.router.navigateByUrl('/preLoading');
  //     return false;
  //     // Aquí se ejecuta la lógica de cierre de sesión
  //     // Puedes llamar al servicio de autenticación para cerrar la sesión y redirigir al usuario a la página de inicio de sesión
  //   });
  // }
  // //resetea el tiempo cuando hay inactividad
  // resetTimer(): void {
  //   console.log('reset timer');
  //   this.stopTimer$.next();
  //   this.stopTimer$.complete();
  //   // this.startTimer(600000); // Reiniciar el temporizador con el tiempo deseado en milisegundos (600000 = 10 minutos)
  //   this.startTimer(10000);
  // }
  // public timer$: Observable<number>;
  // private stopTimer$ = new Subject<void>();
  // constructor(private router: Router) {}
  // startTimer(timeout: number): void {
  //   this.timer$ = timer(timeout).pipe(takeUntil(this.stopTimer$));
  //   this.timer$.subscribe(() => {
  //     this.destroyTimer();
  //     this.router.navigateByUrl('/preLoading');
  //   });
  // }
  // resetTimer(timeout: number): void {
  //   this.stopTimer$.next();
  //   this.startTimer(timeout);
  // }
  // destroyTimer(): void {
  //   this.stopTimer$.next();
  //   this.stopTimer$.complete();
  //   this.timer$ = null;
  // }
  // getTimerValue(): Observable<number> {
  //   return this.timer$;
  // }
}
