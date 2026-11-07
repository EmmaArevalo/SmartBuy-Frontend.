import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  _id: string;
  nombre: string;
  categoria: string;
  marca?: string;
  precio: number;
  stock: number;
}

export type DatosProducto = Omit<Producto, '_id'>;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://smart-buy-api-nine.vercel.app/api/productos';

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  crear(producto: DatosProducto): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  actualizar(id: string, producto: DatosProducto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }
}
