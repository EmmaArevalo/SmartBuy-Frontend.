import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { Producto, ProductosService } from './productos.service';

describe('Gestión de productos Smart Buy', () => {
  let app: App;

  const producto: Producto = {
    _id: 'producto-1',
    nombre: 'Mouse',
    categoria: 'Accesorios',
    marca: 'Logitech',
    precio: 25000,
    stock: 3
  };

  const servicio = {
    listar: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn()
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    servicio.listar.mockReturnValue(of([{ ...producto }]));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ProductosService, useValue: servicio }
      ]
    }).compileComponents();

    app = TestBed.createComponent(App).componentInstance;
    app.ngOnInit();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carga los productos y termina la espera', () => {
    expect(servicio.listar).toHaveBeenCalledOnce();
    expect(app.productos()).toEqual([producto]);
    expect(app.cargando()).toBe(false);
    expect(app.error()).toBe('');
  });

  it('crea un producto y limpia el formulario', () => {
    const nuevo = { ...producto, _id: 'producto-2', nombre: 'Teclado' };
    servicio.crear.mockReturnValue(of(nuevo));

    app.formulario = {
      nombre: 'Teclado',
      categoria: 'Accesorios',
      marca: 'Logitech',
      precio: 25000,
      stock: 3
    };

    app.guardar();

    expect(servicio.crear).toHaveBeenCalledWith({
      nombre: 'Teclado',
      categoria: 'Accesorios',
      marca: 'Logitech',
      precio: 25000,
      stock: 3
    });
    expect(app.productos()).toHaveLength(2);
    expect(app.formulario.nombre).toBe('');
    expect(app.procesando()).toBe(false);
  });

  it('rechaza un stock negativo sin enviar datos', () => {
    app.formulario = {
      nombre: 'Teclado',
      categoria: 'Accesorios',
      marca: 'Logitech',
      precio: 25000,
      stock: -1
    };

    app.guardar();

    expect(servicio.crear).not.toHaveBeenCalled();
    expect(app.error()).not.toBe('');
  });

  it('actualiza el producto seleccionado', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    servicio.actualizar.mockReturnValue(of({ ...producto, stock: 8 }));

    app.editar(producto);
    app.formulario.stock = 8;
    app.guardar();

    expect(servicio.actualizar).toHaveBeenCalledWith(
      producto._id,
      {
        nombre: 'Mouse',
        categoria: 'Accesorios',
        marca: 'Logitech',
        precio: 25000,
        stock: 8
      }
    );
    expect(app.productos()[0].stock).toBe(8);
    expect(app.idEdicion).toBeNull();
  });

  it('elimina un producto después de confirmar', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    servicio.eliminar.mockReturnValue(
      of({ mensaje: 'Producto eliminado correctamente' })
    );

    app.eliminar(producto);

    expect(servicio.eliminar).toHaveBeenCalledWith(producto._id);
    expect(app.productos()).toHaveLength(0);
    expect(app.procesando()).toBe(false);
  });

  it('conserva el producto si se cancela la eliminación', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    app.eliminar(producto);

    expect(servicio.eliminar).not.toHaveBeenCalled();
    expect(app.productos()).toEqual([producto]);
  });

  it('conserva el formulario cuando falla el guardado', () => {
    servicio.crear.mockReturnValue(
      throwError(() => new Error('Sin conexión'))
    );

    app.formulario = {
      nombre: 'Teclado',
      categoria: 'Accesorios',
      marca: 'Logitech',
      precio: 25000,
      stock: 3
    };

    app.guardar();

    expect(app.error()).not.toBe('');
    expect(app.formulario.nombre).toBe('Teclado');
    expect(app.productos()).toHaveLength(1);
    expect(app.procesando()).toBe(false);
  });
}); 