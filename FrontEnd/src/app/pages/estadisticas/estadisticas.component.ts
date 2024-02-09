import { Component, NgZone } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent {
  selectedMonth: number = 1; // Mes predeterminado: enero
  selectedYear: number = 2023;
  cargo = false;
  token;
  nuevaSerieN = [];
  multi: any[];
  single = [
    {
      name: 'Voluntarios',
      value: 10,
    },
    {
      name: 'ONG Aprobadas',
      value: 10,
    },
    {
      name: 'ONG en evaluacion',
      value: 10,
    },
  ];
  multiLinea = [
    {
      name: 'Agosto',
      series: [
        {
          name: '1990',
          value: 0,
        },
      ],
    },
  ];
  nombreMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // view: [number, number] = [700, 400];
  //view: [number, number] = [1000, 500];
  view: [1000, 500];

  //grafico de torta
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = 'nightLights';
  responsive: boolean = true; // lo hace responsive
  maininAspectRatio: boolean = false; // lo hace responsive

  //grafico de Lineas
  legend: boolean = true;

  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  timeline = true;
  yAxisLabel: string = 'Numero de Visitas';
  lineInterpolation = 'step';

  constructor(
    private statisticsService: StatisticsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.token = this.authService.token;
    const multiLinea2 = [
      {
        name: 'Agosto',
        series: [
          {
            name: '',
            value: 1,
          },
        ],
      },
    ];

    console.log(
      '🚀 ~ file: estadisticas.component.ts:187 ~ EstadisticasComponent ~ .subscribe ~ this.multiLinea:',
      multiLinea2
    );
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.statisticsService
      .getStaticsUsers(this.token)
      .subscribe((resp: any) => {
        this.single = [
          {
            name: 'Voluntarios',
            value: resp?.usuarios,
          },
          {
            name: 'ONG Aprobadas',
            value: resp?.ongApproved,
          },
          {
            name: 'ONG en evaluacion',
            value: resp?.ongNoApproved,
          },
        ];
      });
    // this.statisticsService
    //   .getpageViewStatistics(this.token, undefined, 2023)
    //   .subscribe((resp: any) => {
    //     const nombreMeses = [
    //       'Enero',
    //       'Febrero',
    //       'Marzo',
    //       'Abril',
    //       'Mayo',
    //       'Junio',
    //       'Julio',
    //       'Agosto',
    //       'Septiembre',
    //       'Octubre',
    //       'Noviembre',
    //       'Diciembre',
    //     ];

    //     const nuevaSerie = resp.data.series.map((item) => {
    //       const numeroMes = parseInt(item.name.split(' ')[1], 10); // Extrae el número del mes del nombre
    //       const nombreMes = nombreMeses[numeroMes - 1];

    //       const series = item.value.map((value, index) => ({
    //         name: `${nombreMes} - Día ${index + 1}`, // Combina el nombre del mes con el día
    //         value: value,
    //       }));

    //       return {
    //         name: nombreMes, // Usa el nombre del mes como "name"
    //         series: series, // Asigna los días y valores
    //       };
    //     });

    //     this.multiLinea = nuevaSerie;
    //     console.log(
    //       '🚀 ~ file: estadisticas.component.ts:131 ~ EstadisticasComponent ~ .subscribe ~ nuevaSerie:',
    //       nuevaSerie
    //     );
    //   });
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    this.statisticsService
      .getpageViewStatistics(this.token, undefined, anioActual)
      .subscribe((resp: any) => {
        let name: number;
        if (resp.data.series.every((item) => item.name.startsWith('Mes'))) {
          name = anioActual;
          resp.data.series = resp.data.series.map((item) => {
            const numeroMes = parseInt(item.name.split(' ')[1], 10); // Extrae el número del mes del nombre
            item.name = this.nombreMeses[numeroMes - 1];
            return item;
          });
        } else {
          name = 999;
        }

        const nuevaSerie = resp.data.series.map((item) => {
          console.log(item);

          // multiLinea = [
          //   {
          //     name: 'UK',
          //     series: [
          //       {
          //         name: '1990',
          //         value: 57000000,
          //       },
          //       {
          //         name: '2010',
          //         value: 62000000,
          //       },
          //     ],
          //   },
          // ];
          return {
            name: item.name, // Obtiene el campo "name" del objeto original
            value: item.value,
          };
        });

        console.log(
          '🚀 ~ file: estadisticas.component.ts:182 ~ EstadisticasComponent ~ nuevaSerie ~ nuevaSerie:',
          nuevaSerie
        );

        // Agrega las series creadas al arreglo this.multiLinea
        console.log(this.multiLinea);
        this.multiLinea[0].series = nuevaSerie;
        console.log(
          '🚀 ~ file: estadisticas.component.ts:200 ~ EstadisticasComponent ~ .subscribe ~ nuevaSerie:',
          nuevaSerie
        );
        this.nuevaSerieN = this.multiLinea;
        this.multiLinea = this.nuevaSerieN;
        console.log(
          '🚀 ~ file: estadisticas.component.ts:191 ~ EstadisticasComponent ~ .subscribe ~ this.nuevaSerieN:',
          this.nuevaSerieN
        );

        this.multiLinea = [
          {
            name: name.toString(),
            series: nuevaSerie,
          },
        ];
        console.log(
          '🚀 ~ file: estadisticas.component.ts:211 ~ EstadisticasComponent ~ .subscribe ~ this.multiLinea:',
          this.multiLinea
        );
      });
  }
  loadStatistics() {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    console.log(this.selectedMonth);

    if (this.selectedMonth == 20) {
      this.selectedMonth = undefined;
      console.log('es undefinded');
    }

    this.statisticsService
      .getpageViewStatistics(this.token, this.selectedMonth, this.selectedYear)
      .subscribe((resp: any) => {
        let name: number;
        if (resp.data.series.every((item) => item.name.startsWith('Mes'))) {
          if (this.selectedMonth === undefined) {
            name = anioActual;
          } else {
            name = this.selectedYear; // Usar el año seleccionado si se eligió un mes específico
          }
          resp.data.series = resp.data.series.map((item) => {
            const numeroMes = parseInt(item.name.split(' ')[1], 10);
            item.name = this.nombreMeses[numeroMes - 1];
            return item;
          });
        } else {
          name = this.selectedYear;
        }

        const nuevaSerie = resp.data.series.map((item) => {
          console.log(item);
          return {
            name: item.name,
            value: item.value,
          };
        });

        this.multiLinea = [
          {
            name: name.toString(),
            series: nuevaSerie,
          },
        ];
      });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  onSelectBarras(event) {
    console.log(event);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
