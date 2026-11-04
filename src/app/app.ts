import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ProductosService,
  Producto,
  DatosProducto
} from './productos.service';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly servicio = inject(ProductosService);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly procesando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');

  idEdicion: string | null = null;
  formulario = this.formularioVacio();

  private formularioVacio() {
    return {
      nombre: '',
      categoria: '',
      marca: '',
      precio: null as number | null,
      stock: null as number | null
    };
  }

  ngOnInit(): void {
    this.servicio.listar().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudieron cargar los productos. Revisa que la API esté funcionando.'
        );
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (this.procesando() || this.cargando()) return;

    this.error.set('');
    this.mensaje.set('');

    const { nombre, categoria, marca, precio, stock } = this.formulario;

    if (!nombre.trim() || !categoria.trim() || !marca.trim()) {
      this.error.set('Completa el nombre, la categoría y la marca.');
      return;
    }

    if (
      precio === null || !Number.isFinite(precio) || precio < 0 ||
      stock === null || !Number.isInteger(stock) || stock < 0
    ) {
      this.error.set(
          'Ingresa un precio igual o mayor que cero y un stock entero igual o mayor que cero.'
      );
      return;
    }

    const datos: DatosProducto = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      marca: marca.trim(),
      precio,
      stock
    };

    const id = this.idEdicion;
    const solicitud = id
      ? this.servicio.actualizar(id, datos)
      : this.servicio.crear(datos);

    this.procesando.set(true);

    solicitud.subscribe({
      next: (producto) => {
        if (!producto || !producto._id) {
          this.error.set('No se pudo confirmar el producto guardado.');
          this.procesando.set(false);
          return;
        }

        this.productos.update((lista) =>
          id
            ? lista.map((item) => item._id === id ? producto : item)
            : [...lista, producto]
        );

        this.cancelar();
        this.mensaje.set(
          id ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'
        );
        this.procesando.set(false);
      },
      error: () => {
        this.error.set('No se pudo guardar. Revisa los datos y la conexión con la API.');
        this.procesando.set(false);
      }
    });
  }

  editar(producto: Producto): void {
    if (this.procesando()) return;

    this.idEdicion = producto._id;
    this.formulario = {
      nombre: producto.nombre,
      categoria: producto.categoria,
      marca: producto.marca || '',
      precio: producto.precio,
      stock: producto.stock
    };

    this.error.set('');
    this.mensaje.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar(): void {
    this.idEdicion = null;
    this.formulario = this.formularioVacio();
  }

  eliminar(producto: Producto): void {
    if (this.procesando()) return;

    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.procesando.set(true);

    this.servicio.eliminar(producto._id).subscribe({
      next: () => {
        this.productos.update((lista) =>
          lista.filter((item) => item._id !== producto._id)
        );

        if (this.idEdicion === producto._id) this.cancelar();

        this.mensaje.set('Producto eliminado correctamente.');
        this.procesando.set(false);
      },
      error: () => {
        this.error.set('No se pudo eliminar el producto. Revisa la conexión con la API.');
        this.procesando.set(false);
      }
    });
  }
}
