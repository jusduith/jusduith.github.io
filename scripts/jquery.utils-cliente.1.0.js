/**
 * Extiende la funcionalidad de jQuery con funciones
 */
jQuery.fn.extend(
    {
        /**
         *Función decimal(...) Esto permite llamar $("#input").decimal() para 2 dígitos por defecto o $("#input").decimal(4) para 4 decimales
         * @param {} numDecimalPlaces : número de posiciones decimales
         * @returns {} void
         */
        decimal: function (numDecimalPlaces) {
            //jQuery selector
            var selfSelector = this;

            if (!numDecimalPlaces || numDecimalPlaces < 2) {
                numDecimalPlaces = 2;
            };

            //para cada resultado del selector(normalmente uno si se usa el #)
            selfSelector.each(function () {
                var self = $(this);
                //evento keypress
                self.keypress(function (evt) {
                    var charComma = 44;
                    var charMinus = 45;
                    var charDot = 46;
                    var charZero = 48;
                    var charNine = 57;
                    var charCode = evt.which ? evt.which : event.keyCode;
                    var number = this.value.split(/[.,]+/);

                    if (charCode != charComma && charCode != charMinus && charCode != charDot && charCode > 31
                        && (charCode < charZero || charCode > charNine)) {
                        return false;
                    }
                    //si tiene ',' e intento introducir un ','
                    if (number.length > 1 && (charCode == charComma || charCode == charDot))
                        return false;
                    // si tiene un '-', ya no puede introducir otro
                    if (this.value.indexOf('-') > -1 && charCode == charMinus)
                        return false;
                    // siempre debe estar en la primera posición si introducimos '-'
                    if (this.selectionStart > 0 && charCode == charMinus)
                        return false;

                    var caretPos = this.selectionStart;
                    var dotPos = this.value.indexOf(".");

                    if (!dotPos || dotPos < 0) {
                        dotPos = this.value.indexOf(",");
                    }

                    if (caretPos > dotPos && dotPos > -1 && (number[1].length > numDecimalPlaces - 1)) {
                        return false;
                    }
                    return true;
                });

                //Evento paste
                self.on("paste", function (e) {
                    setTimeout(function () {
                        var number = parseFloat(self.val()).toFixed(2);

                        if (!isNaN(number)) {
                            self.val(number.replace(".", ","));
                        }
                        else {
                            self.val('');
                        }
                    }, 0);
                });
            });
        },
        /*
        ** Función entero()
        ** Esto permite llamar $("#input").entero()
        */
        entero: function () {
            //jQuery selector
            var selfSelector = this;

            //para cada resultado del selector(normalmente uno si se usa el #)
            selfSelector.each(function () {
                var self = $(this);
                //evento keypress
                self.keypress(function (evt) {
                    var charZero = 48;
                    var charNine = 57;
                    var charCode = evt.which ? evt.which : event.keyCode;

                    if (charCode > 31
                        && (charCode < charZero || charCode > charNine)) {
                        return false;
                    }
                    return true;
                });

                //Evento paste
                self.on("paste", function (e) {
                    setTimeout(function () {
                        var number = parseInt(self.val());
                        if (!isNaN(number)) {
                            self.val(number);
                        }
                        else {
                            self.val('');
                        }
                    }, 0);
                });
            });
        },
        /*
        ** Función disable()
        ** Deshabilita un elemento
        */
        disable: function () {
            //jQuery selector
            var selfSelector = this;
            selfSelector.each(function () {
                if (typeof this.disabled != "undefined") {
                    this.disabled = true;
                }
            });
        },
        /*
        **Habilita un elemento
        */
        enable: function () {
            //jQuery selector
            var selfSelector = this;
            selfSelector.each(function () {
                if (typeof this.disabled != "undefined") {
                    this.disabled = false;
                }
            });
        },
        /*
        *Devuelve el tamaño de cualquier elemento aunque esté oculto*
        */
        getSize: function (width) {
            var $wrap = $("<div />").appendTo($("body"));
            $wrap.css({
                "width": width + 'px',
                "position": "absolute !important",
                "visibility": "hidden !important",
                "display": "block !important"
            });

            $clone = $(this).clone().appendTo($wrap);
            $clone.attr('style', '');

            sizes = {
                "width": $clone.width(),
                "height": $clone.height()
            };
            $wrap.remove();

            return sizes;
        },

        dialog: function () {
            var $obj = $(this);
            return verMensaje($(this).html(),
                {
                    buttons: [],
                    modal: true
                }
            );
        },

        /**
         * Función para gestionar los errores. En caso de que se cumpla la condición de error especificada, se establece la clase de error en el elemento indicado 
         * y se acumula el mensaje de error indicado en errorManager.stringErrores. Si no se cumple la condición de error, se quita el indicador de error del elemento.
         * Cuando no se especifica mensaje de error asociado, se entiende que la validación corresponde a obligatoriedad. En caso de incumplirse, se establecerá
         * errorManager.faltanObligatorios a true
         *
         * @param {Json{Array,bool}} errorManager : objeto Json con propiedades stringErrores (para acumular los mensajes de error) y faltanObligatorios (para indicar si falta algún campo obligatorio)
         * @param {bool} errorCondition: condición de error a evaluar
         * @param {string} errorMessage: mensaje de error asociado a la validación
          */
        checkErrorState: function (errorManager, errorCondition, errorMessage) {
            var $obj = $(this);
            if (errorCondition) {
                $obj.addClass('alert');
                if (!errorMessage)
                    errorManager.faltanObligatorios = true;
                else
                    errorManager.errores.push(errorMessage);
            }
            else
                $obj.removeClass('alert');
        }
    });

/*
* Dirección de scroll
*/
var ScrollDirection =
{
    UP: 1,
    DOWN: 2
};
Object.freeze(ScrollDirection);

/*
 * Tipo de intervalo de los filtros de tipo fecha
 * 
 */
var IntervaloFecha =
{
    INDIFERENTE: -1,
    ULTIMAS_24_HORAS: 1,
    ULTIMA_SEMANA: 2,
    ULTIMO_MES: 4,
    ULTIMO_ANIO: 8,
};
Object.freeze(IntervaloFecha);

/*
 * Tipo de operador usado en cada filtro
 * 
 */
var TipoOperador =
    {
        IGUAL: 0,
        MAYORIGUALQUE: 1,
        MENORIGUALQUE: 2,
        LISTA: 3,
        SCRIPT: 4,
    };

Object.freeze(TipoOperador);

/*
 * Extensiones para campos de tipo fecha
 */

Date.prototype.addDays = function (days, withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.firstWeekDay = function (withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return dat.addDays(-dat.getDay() + 1);
};

Date.prototype.lastWeekDay = function (withoutTime) {
    return new Date(this.valueOf()).firstWeekDay(withoutTime).addDays(6);
};

Date.prototype.firstDayInMonth = function (withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear(), dat.getMonth(), 1);
};

Date.prototype.lastDayInMonth = function (withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear(), dat.getMonth() + 1, 0, dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

Date.prototype.addMonths = function (months, withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear(), dat.getMonth() + months, dat.getDate(), dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

Date.prototype.addYears = function (years, withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear() + years, dat.getMonth(), dat.getDate(), dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

Date.prototype.firstDayInYear = function (withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear(), 0, 1, dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

Date.prototype.lastDayInYear = function (withoutTime) {
    var dat = new Date(this.valueOf());
    if (withoutTime) {
        dat = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    }
    return new Date(dat.getFullYear(), 11, 31, dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds());
};

// Convierte una fecha en formato (dd/MM/yyyy)
Date.prototype.toDateString = function () {
    var date = this;
    return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
}

// Convierte una fecha en formato (dd)
Date.prototype.toDayString = function () {
    var date = this;
    return (date.getDate() > 9) ? date.getDate() : ('0' + date.getDate());
}

// Convierte una fecha en formato (MMM yy)
Date.prototype.toMonthYearString = function () {
    var date = this;
    var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return (months[date.getMonth()] + ' ' + date.getFullYear().toString().substring(2, 4));
}

Date.prototype.toInvariantISODate = function () {
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    };

    var dat = new Date(this.valueOf());
    return this.getFullYear()
       + '-' + f(this.getMonth() + 1)
       + '-' + f(this.getDate())
       + 'T' + f(this.getHours())
       + ':' + f(this.getMinutes())
       + ':' + f(this.getSeconds())
       + '.' + String((this.getMilliseconds() / 1000).toFixed(3)).slice(2, 5)
       + 'Z';
};

/**
 * Función para parsear fechas
 * @param {} value : cadena
 * @returns {} Fecha o null
 */
function parseDate(value) {
    var date = null;
    try {
        if (value && value.length > 0) {
            date = $.datepicker.parseDate('dd/mm/yy', value);
        }
    }
    catch (ex) {
        date = null;
    }

    return date;
};

/*
 * Extensiones para string
 */
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined'
          ? args[number]
          : match
        ;
    });
};
/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {

        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);
    };
}

/**
 * Una función para validar uris. Se llamaría isValidUri("http://www.microsoft.es")
 * @returns Boolean
 */
function isValidUri(uri) {
    if (!uri || uri.length === 0) {
        return false;
    }
    var uriString = /[-a-zA-Z0-9@@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@@:%_\+.~#?&//=]*)?/gi;
    var regexUri = new RegExp(uriString);

    return uri.match(regexUri);
};



/*
 * Constante de animación. De momento no se usa
 * 
 */
var Constantes =
    {
        ANIMATION_TIME: 250,
    };

Object.freeze(Constantes);

var TipoBusquedaRecurso =
    {
        Normal: 1,
        Recurso: 2
    };

Object.freeze(TipoBusquedaRecurso);
/*
 * Tipo de recurso
 */
var TipoRecurso =
{
    Legislacion: 1,
    Jurisprudencia: 2,
    OrganosConsultivos: 3,
    EmpleoPublico: 4,
    Subvenciones: 5,
    Expedientes: 6,
    Modelos: 7,
    ConsultasPublicas: 8,
    Noticias: 9,
    Articulos: 10,
    Apuntes: 11,
    ActuacionesControl: 12,
    BasesRRHH: 13,
    Cursos: 14,
    AulaVirtual: 15,
    ConsultasPrivadas: 20,
    GuiasDidacticas: 30,
    Simuladores: 31,
    HojasdeTrabajo: 32,
    CuadrosComparativos: 33,
    Proyectos: 34,
    Fichas: 35,
    VideoTutoriales: 36,
    Infografias: 37,
    MisEstudios: 40,
    Monograficos: 50,
    UnidadesDidacticas: 51
};
Object.freeze(TipoRecurso);

/*
 * Tipo de Módulo
 */
var TipoModulo =
    {
        Ninguno: 0,
        Actualidad: 1,
        Expedientes: 2,
        Consultas: 3,
        Base_Datos: 4,
        Hacienda_Local: 5,
        Recursos_Humanos: 6,
        Administracion_Electronica: 7,
        Mis_Estudios: 10,
        Areas_Tematicas: 11,
        Formacion: 12,
        ControlInterno: 13,
        BasesRRHH: 14,
        AulaVirtual: 15
    };
Object.freeze(TipoModulo);


/*
 * Tipo de Red Social. Uso en cliente
 * 
 */
var TipoRedSocial =
    {
        Facebook: 1,
        Twitter: 2,
        LinkedIn: 3
    };
Object.freeze(TipoRedSocial);

/*
 * Idioma
 */
var Idioma =
{
    Castellano: 1,
    Catalan: 2,
    Valenciano: 3,
    Gallego: 5
};
Object.freeze(Idioma);

/*
 * Tipo de Ámbito
 */
var TipoAmbito =
{
    Europa: 1,
    TerritorioNacional: 2,
    ComunidadAutonoma: 3,
    Provincia: 4
};
Object.freeze(TipoAmbito);

/*
 * Configuración del filtro de ambito de usuario
 */
var TipoFiltroAmbitoUsuario =
    {
        Estatal_CCAA_Usuario: 1,
        CCAA_Usuario: 2,
        UE_Estatal_CCAA_Provincia_Usuario: 4,
        Estatal_Deplegable_CCAA_Usuario: 8,
        UE_Estatal_Desplegable_CCAA_Provincia_Usuario: 16,
        Todos: 32,
    };

Object.freeze(TipoFiltroAmbitoUsuario);
/*
 * Teclas comunes
 */
var Keys =
    {
        CR: 10,
        LF: 13,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40,
        BLOQ: 144,
        END: 35,
        HOME: 36,
        CTRL: 17,
        SHIFT: 16,
        ALTGR: 18,
        BLOQ_SHIFT: 20,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        MENU: 93,
        TAB: 9,
        INSERT: 45,
        ESCAPE: 27
    };
Object.freeze(Keys);

/*
 * Máximo nivel de desarrollo del filtro de áreas de expediente
 */
var TipoNivelArea =
    {
        Area: 1,
        Materia: 2,
        Submateria: 3,
        CodigoExpediente: 4
    };

Object.freeze(TipoNivelArea);

/*
* Máximo nivel de desarrollo del filtro de áreas temáticas
*/
var TipoNivelAreaTematica =
    {
        AreaTematica: 1,
        UnidadDidactica: 2
    };

Object.freeze(TipoNivelAreaTematica);

/**
 * Plataforma
 */
var Plataforma =
    {
        Corporativa: 1,
        Hacienda_Local: 10,
        RRHH: 15
    };
Object.freeze(Plataforma);

/*Funciones para IE<=11*/

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function (owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function () {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
};

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
};

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
};

if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf = function (find, i /*opt*/) {
        if (i === undefined) i = this.length - 1;
        if (i < 0) i += this.length;
        if (i > this.length - 1) i = this.length - 1;
        for (i++; i-- > 0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
};

if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
};

if (!('map' in Array.prototype)) {
    Array.prototype.map = function (mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                other[i] = mapper.call(that, this[i], i, this);
        return other;
    };
};

if (!('filter' in Array.prototype)) {
    Array.prototype.filter = function (filter, that /*opt*/) {
        var other = [], v;
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && filter.call(that, v = this[i], i, this))
                other.push(v);
        return other;
    };
};



if (!('every' in Array.prototype)) {
    Array.prototype.every = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
};

if (!('some' in Array.prototype)) {
    Array.prototype.some = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
};

if (!('find' in Array.prototype)) {
    Array.prototype.find = function (findz, that /*opt*/) {
        var v;
        var result = null;
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this && findz.call(that, v = this[i], i, this)) {
                result = v;
                break;
            }
        }
        return result;
    };
};

if (!('remove' in Array.prototype)) {
    Array.prototype.remove = function (value, that /*opt*/) {
        var i = this.indexOf(value);
        if (i > -1) {
            this.splice(i, 1);
        }
    };
};

if (!('addIfNotExists' in Array.prototype)) {
    Array.prototype.addIfNotExists = function (value, that /*opt*/) {
        var i = this.indexOf(value);
        if (i < 0) {
            this.push(value);
        }
    };
};


if (!('getHTMLAvisos' in Array.prototype)) {
    Array.prototype.getHTMLAvisos = function (titulo, options) {
        options = $.extend({},
            {
                extra: null,
                icon: 'icon-arrow'
            }, options);
        var mensaje = titulo.toHTMLAdvert({ strong: true });
        if (options.extra) mensaje += options.extra;
        if (this.length) {
            mensaje += '<br/><ul class="list list-icon compact">'
            $.each(this, function (index, value) {
                mensaje += '<li><div>' + (options.icon == null ? '' : '<span class="' + options.icon + '"></span>') + value + '</div></li>';
            });
            mensaje += '</ul>';
        }

        return mensaje;
    };
};

if (!('toHTMLTexto' in String.prototype)) {
    String.prototype.toHTMLTexto = function (options) {
        options = $.extend({},
        {
            p: false,
            lead: false,
            strong: true,
            color: 'color05',
            icon: null,
            iconSize: 'icon-big',
            iconColor: 'color06'
        }, options);
        var texto = this;
        
        if (regexIndexOf(texto, /(?:\r\n|\r|\n)/, 0) > -1)
            texto = '<p' + (options.lead ? ' class="lead"' : '') + '>' + this.replace(/(?:\r\n|\r|\n)/g, '</p><p class="' + (options.lead ? 'lead' : '') + '">') + '</p>'; //Cambiar saltos de línea por párrafos.
        return '<' + (options.p ? 'p' : 'div') + ' class="' + (options.lead ? 'lead' : '') + ' ' + (options.strong ? 'strong' : '') + ' ' + (options.color ? options.color : '') + '">' + (options.icon != null ? '<span class="' + options.icon + ' ' + options.iconSize + ' ' + options.iconColor + '"></span> ' : '') + texto + '</' + (options.p ? 'p' : 'div') + '>';
    };
};

function regexIndexOf(text, re, i) {
    var indexInSuffix = text.slice(i).search(re);
    return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + i;
}


if (!('toHTMLParrafo' in String.prototype)) {
    String.prototype.toHTMLParrafo = function (large) {
        return this.toHTMLTexto({
            p: true,
            lead: large,
            strong: false,
            color: null,
            icon: null
        });
    };
};

/**
* Devuelve el texto "¿Desea continuar?" y color Azul oscuro
* @param {bool} small Devuelve el texto en formato pequeño
*/
function getHTMLDeseaContinuar(small) {
    const txtDeseaContinuar = [];
    txtDeseaContinuar[Idioma.Castellano] = '¿Desea continuar?';
    txtDeseaContinuar[Idioma.Catalan] = 'Desitja continuar?';
    txtDeseaContinuar[Idioma.Valenciano] = 'Desitja continuar?';
    txtDeseaContinuar[Idioma.Gallego] = 'Desexa continuar?'

    let texto = txtDeseaContinuar[_language];
    return texto.toHTMLTexto({
        p: true,
        lead: !small,
        strong: true,
        color: 'color05',
        icon: null
    });
}

if (!('toHTMLError' in String.prototype)) {
    String.prototype.toHTMLError = function (options) {
        options = $.extend({},
            {
                lead: true,
                icon: 'icon-x',
                iconColor: 'color06',
                strong: false
            }, options);
        return this.toHTMLTexto(options);
    };
};

if (!('toHTMLAdvert' in String.prototype)) {
    String.prototype.toHTMLAdvert = function (options) {
        options = $.extend({},
            {
                lead: true,
                icon: 'icon-advert',
                iconColor: 'color00',
                strong: false
            }, options);
        return this.toHTMLTexto(options);
    };
};

if (!('toHTMLInfo' in String.prototype)) {
    String.prototype.toHTMLInfo = function (options) {
        options = $.extend({},
            {
                lead: true,
                icon: 'icon-info',
                iconColor: 'color03',
                strong: false
            }, options);
        return this.toHTMLTexto(options);
    };
};

if (!('getHTMLErrores' in Array.prototype)) {
    Array.prototype.getHTMLErrores = function (cabeceraError, options) {
        const txtCabeceraDefecto = [];
        txtCabeceraDefecto[Idioma.Castellano] = 'SE ENCONTRARON LOS SIGUIENTES ERRORES:';
        txtCabeceraDefecto[Idioma.Catalan] = 'ES VAN TROBAR ELS SEGÜENTS ERRORS:';
        txtCabeceraDefecto[Idioma.Valenciano] = 'ES VAN TROBAR ELS SEGÜENTS ERRORS:';
        txtCabeceraDefecto[Idioma.Gallego] = 'ATOPÁRONSE OS SEGUINTES ERROS:'

        cabeceraError = cabeceraError ?? txtCabeceraDefecto[_language];
        options = $.extend({},
            {
                icon: 'icon-arrow'
            }, options);
        var mensaje = '';
        if (this.length) {
            mensaje = cabeceraError.toHTMLError(true);
            mensaje += '<br/><ul class="list list-icon compact">';
            $.each(this, function (index, value) {
                mensaje += '<li><div>' + (options.icon == null ? '' : '<span class="' + options.icon + '"></span>') + value + '</div></li>';
            });
            mensaje += '</ul>';
        }
        return mensaje;
    };
};

/*
 * Autenticación
 */
function controlSesionAJAX(data) {
    if (data.sesionCaducada) {
        return verMensaje(data.mensaje.toHTMLAdvert(), {
            buttons: [{
                id: 'cancel',
                backgroundColor: 'bg-color01',
                value: 'Cerrar',
                onclick: '$.fancybox.close(); window.location.reload(); return false;'
            }],
            modal: true
        });
    }
    return true;
};
/**
 * Clase para almacenar clave y valor
 * @param {any} intKey
 * @param {any} stringValue
*  @param {any} alternateKey
 * @param {any} alternateValue
 */
function KeyValuePair(intKey, stringValue, alternateKey, alternateValue) {
    this.Key = intKey;
    this.Value = stringValue;
    this.AlternateKey = alternateKey;
    this.AlternateValue = alternateValue;
};

/* 
* Escapa los caracteres html de la cadena para que pueda ser enviada al servidor de forma segura
*/
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    };
    return text.replace(/[&<>]/g, function (m) { return map[m]; });
}

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

/**
* Funcion para almacenar una cookie
* @param {name} nombre de la cookie
* @param {value} valor de la cookie
* @param {days} dias hasta que expire, si no se especifica expira al terminar la sesión
*/
function setCookie(name, value, days, domain) {
    var expires = '';
    var date = new Date();
    if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + (domain ? "; domain=" + domain : "") + "; path=/;SameSite=Lax;secure";
}
/**
* Funcion para leer una cookie
* @param {name} nombre de la cookie
*/
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    var valueCookie = null;
    jQuery.each(ca, function (index, value) {
        while (value.charAt(0) == ' ')
            value = value.substring(1, value.length);
        if (value.indexOf(nameEQ) == 0)
            valueCookie = value.substring(nameEQ.length, value.length);
    });
    return valueCookie;
}
/**
* Funcion para eliminar una cookie
* @param {name} nombre de la cookie
*/
function deleteCookie(name, domain) {
    setCookie(name, "", -1, domain);
}

function deleteCookies(names, domain) {
    jQuery.each(names, function (index, value) {
        deleteCookie(value, domain);
    });
}

/**
* Función que mueve el scroll hasta subir arriba
*
*/
function goTOP() {
    jQuery('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    return false;
}

/**
* Función que mueve el scroll hasta bajar abajo
*
*/
function goBOTTOM(obj, height) {
    if (!height) height = 100;
    jQuery('html, body').animate({ scrollTop: $(obj).offset().top - height }, 500, 'swing');
    return false;
}

// Copies a string to the clipboard. Must be called from within an event handler such as click.
// May return false if it failed, but this is not always
// possible. Browser support for Chrome 43+, Firefox 42+, Edge and IE 10+.
// No Safari support, as of (Nov. 2015). Returns false.
// IE: The clipboard feature may be disabled by an adminstrator. By default a prompt is
// shown the first time the clipboard is used (per session).
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var input = document.createElement("input");
        $(input).val(text);
        document.body.appendChild(input);
        $(input).select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(input);
        }
    }
}

/*
 * Abre una nueva ventana
 * @param {any} url
 * @param {any} title
 * @param {any} w
 * @param {any} h
 */
function WindowOpen(url, title, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if (window.focus) {
        newWindow.focus();
    }
}

/*FUNCIONES DEPENDIENTES DE FANCYBOX*/

//mostrarModal('[url]',
//              {
//                  [opcion1]: '', -> p.ejemplo: width: 1000
//                  ...
//                  [opcionn]: '' -> p.ejemplo: modal: true
//                  [opcionn]: '' -> p.ejemplo: autoDimensions: true (para que se dimensione según el contenido y no haga caso de las especificaciones de ancho y alto)
//              });
function mostrarModal(url, options) {
    options = $.extend({},
        {
            width: '50%',
            height: 'auto',
            autoDimensions: false,
            autoSize: false,
            padding: 0,
            type: 'iframe',
            modal: true,
            href: url
        }, options);
    //Hace el efecto hideScrollbar para la versión fancybox 2.1.4 que es la que tenemos
    if (options.hideScrollbar) {
        options.afterLoad = function () {
            $('.fancybox-iframe').attr('scrolling', 'no');
        }
    }
    $.fancybox(options);
    return false;
}

//verMensaje('[mensaje en formato texto o html]',
//              {
//                  [opcion1]: '', -> p.ejemplo: width: 1000
//                  [opcion2]: '', -> p.ejemplo: btn: '<input type="button" class="button bg-color01 upper" id="aceptar" value="Aceptar" onclick="return aceptar();" /><input type="button" id="cancelar" value="Cancelar" onclick="return cancelar()" />'
//                  ...
//                  [opcionn]: '' -> p.ejemplo: modal: true
//                  [opcionn]: '' -> p.ejemplo: autoDimensions: true (para que se dimensione según el contenido y no haga caso de las especificaciones de ancho y alto)
//              });
function verMensaje(mensaje, options) {
    mensaje = (mensaje ? mensaje : '');
    options = $.extend({},
        {
            buttons: [{
                id: 'ok',
                value: 'Cerrar',
                backgroundColor: 'bg-color01',
                clasesAdicionales: '',
                onclick: '$.fancybox.close(); return false;'
            }],
            transitionIn: 'elastic',
            transitionOut: 'elastic',
            autoDimensions: true,
            autoSize: true,
            modal: false,
            overflow: false,
            align: 'center',
            backgroundColor: '#fff',
            width: Math.min(550, $(window).width() - 80),
            height: 200,
            content: ''
        }, options);

    options.minWidth = options.width;
    options.minHeight = options.overflow ? options.height - 100 : 0;
    options.width = options.autoDimensions ? 'auto' : options.width;
    options.height = options.autoDimensions ? (options.overflow ? window.innerHeight - 100 : 'auto') : options.height;

    var preRowT = '<div class="row" style="min-width: ' + options.minWidth + 'px; min-height:' + options.minHeight + 'px; background-color: ' + options.backgroundColor + '">';
    var preRowB = '<div class="row" style="margin-top: 20px; min-height: 32px">';
    var lastRow = '</div>';
    var preColT = '<div class="columns large-12 text-' + options.align + '">';
    var preColB = '<div class="columns large-12 text-center">';
    var preColOverflow = '<div class="columns large-12 text-left" style="overflow-y: auto; max-height: ' + (options.height - (options.btn == '' ? 0 : 50)) + 'px">';
    var lastCol = '</div>';
    var preP = '<p>';
    var lastP = '</p>';

    var btn = '';
    if (options.buttons && options.buttons.length) {
        options.buttons.map(function (n, i) {
            btn += '<button id="' + n.id + '" class="button ' + (n.backgroundColor ? n.backgroundColor : 'bg-color01') + ' upper ' + n.clasesAdicionales + '" onclick="' + n.onclick + '" ' + (n.disabled ? 'disabled' : '') + '>' + n.value + '</button>&nbsp;'
        });
    }

    options.content = preRowT + (options.overflow ? preColOverflow : preColT) + mensaje + lastCol + lastRow +
        (!btn ? '' : preRowB + preColB + btn + lastCol + lastRow);

    $.fancybox(options);
    return false;
}

function verMensajeOK(data) {
    const txtBoton = [];
    txtBoton[Idioma.Castellano] = 'Cerrar';
    txtBoton[Idioma.Catalan] = 'Tancar';
    txtBoton[Idioma.Valenciano] = 'Tancar';
    txtBoton[Idioma.Gallego] = 'Pechar'

    return verMensaje(data.mensaje.toHTMLInfo(),
        {
            buttons: [
               {
                   id: 'ok',
                   value: txtBoton[_language],
                   onclick: data.onclick
               }
            ],
            modal: true
        }
    );
}

function verMensajeError(data) {
    const txtBoton = [];
    txtBoton[Idioma.Castellano] = 'Cerrar';
    txtBoton[Idioma.Catalan] = 'Tancar';
    txtBoton[Idioma.Valenciano] = 'Tancar';
    txtBoton[Idioma.Gallego] = 'Pechar'

    if (!data.onclick)
        data.onclick = "$.fancybox.close(); return false";
    return verMensaje(data.mensaje.toHTMLError(), {
            buttons: [
                {
                    id: 'ok',
                    value: txtBoton[_language],
                    onclick: data.onclick
                }
            ],
            modal: true
        }
    );
}

function verMensajeEspera(mensaje) {
    if (!mensaje) mensaje = 'Espere por favor...';
    verMensaje('<p class="lead" style="white-space: nowrap;">' + mensaje + '</p><p style="text-align: center"><img src="/Content/img/loading.svg" style="width: 30px" /></p>',
        {
            modal: true,
            buttons: null
        }
    );
}

/*FUNCIÓN QUE DEVUELVE UN FICHERO SUBIDO*/
function attach(obj, multiple) { //Descargar ficheros adjuntos
    navigateWithPost('/home/descarga/', {
        fichero: $(obj).text(),
        multiple: multiple
    });
    return false;
}

/**
 * Elimina la clase de error de todos los elementos de la página
 * Necesario antes de pasar de nuevo las validaciones de errores, para evitar que algún elemento quede incorrectamente marcado
  */
function clearErrorState() {
    $('input,select').removeClass('alert');
};

/*
 * Crea una clave de la query string. Por ejemplo:
 *   addURLParameter('/Edit', 'IdBusqueda=1') == '/Edit?IdBusqueda=1'
 *   addURLParameter('/Edit?x=0', 'IdBusqueda=1') == '/Edit?x=0&IdBusqueda=1'
 * @param {string} url
 * @param {string} parameter
 */
function addURLParameter(url, parameter) {
    //OJO endsWith no soportado en IE
    if (url.substr(url.length - 1, 1) == '#')
        url = url.substr(0, url.length - 1);
    return url + (url.indexOf('?') == -1 ? '?' : '&') + parameter;
}

/*
 * Elimina una clave de la query string. Por ejemplo:
 *   removeURLParameter('/Edit?IdBusqueda=1', 'IdBusqueda') == '/Edit'
 *   removeURLParameter('/Edit?IdBusqueda=', 'IdBusqueda') == '/Edit'
 * @param {string} url
 * @param {string} parameter
 */
function removeURLParameter(url, parameter) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        for (var i = pars.length; i-- > 0;) {
            if (pars[i].length == 0 || pars[i].toLowerCase().lastIndexOf(prefix.toLowerCase(), 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    }
    else {
        return url;
    }
}

/*
 * Elimina una clave de la query string. Por ejemplo:
 *   removeURLParameters('/Edit?IdBusqueda=1&print=true', ['IdBusqueda', 'print']) == '/Edit'
 * @param {string} url
 * @param {array} parameters
 */
function removeURLParameters(url, parameters) {
    parameters = parameters || [];
    parameters.forEach(function (value) {
        url = removeURLParameter(url, value);
    });
    return url;
}

/**
 * Función que se llama cuando se quiere compartir rápido un recurso y añadir un comentario global
 * @param {number} idTipoRecurso
 * @param {number} idItem
 * @returns
 */
function compartirRecurso(idTipoRecurso, idItem) {
    return compartirPersonalizado([], idTipoRecurso, idItem, true, '', 'callbackCompartirRecurso');
}

/**
 * @param {number[]} usuarios - lista de ids
 * @param {number} idTipoRecurso - identificación del recurso
 * @param {number} idItem - identificación del recurso
 * @param {boolean} comentar - indica si se debe comentar o no
 * @param {string} tag - identificador único que se usa en el callback
 * @param {string} callbackFunction - función que se llama cuando se da a aceptar
 * */
function compartirPersonalizado(usuarios, idTipoRecurso, idItem, comentar, tag, callbackFunction) {
    $.fancybox.showLoading();
    const query = `/Personalizacion/EditCompartirPersonalizado?IdTipoRecurso=${idTipoRecurso}&IdItem=${idItem}&Comentar=${comentar}&Usuarios=${(usuarios || []).join(',')}&Tag=${encodeURIComponent(tag || '')}&CallbackFunction=${callbackFunction}`;
    return mostrarModal(query, {
        width: Math.min(window.outerWidth, 920),
        modal: false,
        afterClose: function () {
            $.fancybox.hideLoading();
        }
    });
    return false;
}

/**
 * Función de devolución de llamada cuando se comparte un recurso desde las botoneras de opciones
 * @param {any} data - información para compartir
 */
function callbackCompartirRecurso(data) {
    if (!data?.Ok) {
        return;
    }
    const TIPOCOMPARTIDO_ENTIDAD = 1;
    const TIPOCOMPARTIDO_EQUIPO = 2;
    const TIPOCOMPARTIDO_USUARIO = 3;
    const IDSUBRAYADO = -1;
    const IDCOMPARTIDO = -1;
    const FECHACREACION = new Date().toISOString();
    const IDIOMA_CASTELLANO = 1;

    const newSubrayado = {
        IdSubrayado: IDSUBRAYADO,
        IdTipoRecurso: data.IdTipoRecurso,
        IdItem: data.IdItem,
        Idioma: IDIOMA_CASTELLANO,
        IdUsuario: data.IdUsuario,
        FechaCreacion: FECHACREACION,
        Comentarios: [{
            IdSubrayado: IDSUBRAYADO,
            Orden: 0,
            IdUsuario: data.IdUsuario,
            Comentario: escapeHtml(data.Comentario),
            FechaCreacion: FECHACREACION,
            FechaActualizacion: FECHACREACION,
        }],
        Compartidos: []
    }

    if (data.Entidad) {
        newSubrayado.Compartidos.push({
            IdSubrayado: IDSUBRAYADO, IdCompartido: IDCOMPARTIDO, IdCompartidoOriginal: IDCOMPARTIDO, IdPlataforma: data.IdPlataforma, IdEntidad: data.IdEntidad, FechaCompartido: FECHACREACION, TipoCompartido: TIPOCOMPARTIDO_ENTIDAD
        });
    } else if (data.IdEquipo) {
        newSubrayado.Compartidos.push({
            IdSubrayado: IDSUBRAYADO, IdCompartido: IDCOMPARTIDO, IdCompartidoOriginal: IDCOMPARTIDO, IdPlataforma: data.IdPlataforma, IdEntidad: data.IdEntidad, IdEquipo: data.IdEquipo, FechaCompartido: FECHACREACION, TipoCompartido: TIPOCOMPARTIDO_EQUIPO
        });
    } else {
        data.Usuarios.forEach(function (usuario, index) {
            newSubrayado.Compartidos.push({
                IdSubrayado: IDSUBRAYADO, IdCompartido: -(index + 1), IdCompartidoOriginal: -(index + 1), IdPlataforma: data.IdPlataforma, IdEntidad: data.IdEntidad, IdUsuario: usuario.IdUsuario, FechaCompartido: FECHACREACION, TipoCompartido: TIPOCOMPARTIDO_USUARIO
            });
        })
    }
    
    $.post('/Personalizacion/SetSubrayado', newSubrayado, function (data) {
        if (!controlSesionAJAX(data)) {
            return false;
        }
        if (!data.ok) {
            verMensaje(data.mensaje.toHTMLError());
            return false;
        }
        // Refrescar Widget Subrayados
        if(typeof cargarWidgetSubrayados === 'function') {
            cargarWidgetSubrayados();
        }
    });
}

/**
 * Permite compartir un recurso en una red social
 * @param {int} idTipoRecurso del tipo de recurso
 * @param {int} idItem el item
 * @param {string} urlRecurso url absoluta del recurso a compartir
 * @param {TipoRedSocial} tipoRedSocial el tipo de red social, o vacío para copiar al portapapeles
 */
function compartirRedSocial(idTipoRecurso, idItem, urlRecurso, tipoRedSocial) {
    //Guardar visita
    if (tipoRedSocial)
        $.post('/Home/SetRedSocial', { IdItem: idItem, IdTipoRecurso: idTipoRecurso, TipoRedSocial: tipoRedSocial });

    let facebookQueryUrl = 'https://www.facebook.com/sharer/sharer.php?u=';
    let twitterQueryUrl = 'http://twitter.com/share?url=';
    let linkedInQueryUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=';
    switch (tipoRedSocial) {
        case TipoRedSocial.Facebook:
            WindowOpen(facebookQueryUrl + encodeURIComponent(urlRecurso), 'Compartir', 640, 480);
            $.fancybox.close();
            return false;
        case TipoRedSocial.Twitter:
            WindowOpen(twitterQueryUrl + encodeURIComponent(urlRecurso), 'Compartir', 640, 480);
            $.fancybox.close();
            return false;
        case TipoRedSocial.LinkedIn:
            WindowOpen(linkedInQueryUrl + encodeURIComponent(urlRecurso), 'Compartir', 800, 600);
            $.fancybox.close();
            return false;
        default: //Copiar al portapapeles
            if (copyToClipboard(urlRecurso))
                return verMensaje('El enlace se ha copiado al portapapeles'.toHTMLInfo());
    }
}

/**
 * Establece un recurso como favorito de manera centralizada. Retorna Promise
 * @param {tipoRecurso} idTipoRecurso el tipo de recurso
 * @param {int} idItem el item
 * @param {boolean} set si establecer o no
 * @param {function} callback el callback que se ejecuta 
 * @returns {JQuery.jqXHR} un valor
 */
function setFavorito(idTipoRecurso, idItem, set, callback) {
    return $.post('/Personalizacion/SetMiFavorito',
        {
            'idTipoRecurso': idTipoRecurso,
            'idItem': idItem,
            'set': set
        },
        function (data) {
            controlSesionAJAX(data, window.location.pathname + window.location.search);
            if (typeof callback == "function" && callback != null) {
                callback(data);
            }
        });
}
/*
 * Establece un recurso como favorito de manera centralizada.
 * @param {element} element
 * @param {function} callback
 */
function setFavoritoFromElement(element, callback) {
    if (typeof Overlay !== "undefined") {
        Overlay.Show();
    }
    let set = !$(element).hasClass("fav");
    let idTipoRecurso = $(element).data("tiporecurso");
    let idItem = $(element).data("iditem");

    setFavorito(idTipoRecurso, idItem, set, function (data) {
        if (typeof Overlay !== "undefined") {
            Overlay.Hide();
        }
        if (typeof callback == "function" && callback != null) {
            callback(data);
        }
        $(element).toggleClass("fav");
    });
    return false;
}

/*
 * Establece un recurso para recibir avisos de cambio de manera centralizada.
 * @param {element} element
 */
function setAvisosRecursoFromElement(element) {
    let set = !$(element).hasClass("getnotice");
    let idTipoRecurso = $(element).data("tiporecurso");
    let idItem = $(element).data("iditem");
    $.post(
        '/Home/setMiAvisoRecurso',
        {
            'idTipoRecurso': idTipoRecurso,
            'idItem': idItem,
            'set': set
        },
        function (data) {
            if (!controlSesionAJAX(data)) return false;
            if (data.ok)
                $(element).toggleClass("getnotice");
            else if (data.mensaje == "NoAutorizado") {
                $.fancybox.close();
                window.parent.location.href = '/ErrorUnauthorized';
                return;
            }
            var mensaje;
            if (data.ok) mensaje = data.mensaje.toHTMLInfo();
            else mensaje = data.mensaje.toHTMLError();
            return verMensaje(mensaje);
        }
    );
    return false;
}


//Devuelve la extensión de un nombre completo de fichero
String.prototype.getExtension = function () {
    var re = /(?:\.([^.]+))?$/;
    return re.exec(this)[1].toLowerCase();
};

String.prototype.iconExtension = function () {
    switch (this.getExtension()) {
        case 'doc':
            return "icon-word";
        case 'xls':
            return "icon-excel";
        case 'xlsx':
            return "icon-excel2";
        case 'pdf':
            return "icon-pdf";
        default:
            return "icon-doc";
    }
};

/*Validaciones*/
String.prototype.validarMovil = function () {
    var re = /^[6|7]{1}[0-9]*$/g;
    return this.length == 9 && re.test(this);
};

String.prototype.validarTelefono = function () {
    var re = /^[6|7|8|9]{1}[0-9]*$/g;
    return this.length == 9 && re.test(this);
};

String.prototype.validarEmail = function () {
    var re = /(?!.*[áéíóúäëïöüàèìòùâêîôûñ]+.*)(^(([^<>()\[\]\\.,;:`´\s@"]+(\.[^<>()\[\]\\.,;:`´\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z-0-9]+\.)+[a-z]{2,}))$)/gi;
    return re.test(this);
};

String.prototype.validarCP = function () {
    var re = /0[1-9][0-9]{3}|[1-4][0-9]{4}|5[0-2][0-9]{3}/;
    return re.test(this);
};

String.prototype.validarFecha = function () {
    var re = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
    return re.test(this);
};

jQuery.fn.getWidth = function () {
    var target_width = parseFloat(this.width());
    var target_parent_width = parseFloat($(this).parent().width());
    $('body').append('<div  id="temporary_document_resizer_holder"  style="width:5000px;height:5000px;"></div>');
    var target_temp_width = parseFloat($(this).clone().html('_blank_').appendTo('#temporary_document_resizer_holder').width());
    $('#temporary_document_resizer_holder').remove();

    return target_width == target_temp_width ? target_width : (Math.round(100 * target_width / target_parent_width) + '%');
}

jQuery.fn.getHeight = function () {
    var target_height = parseFloat(this.height());
    var target_parent_height = parseFloat($(this).parent().height());
    $('body').append('<div  id="temporary_document_resizer_holder"  style="width:5000px;height:5000px;"></div>');
    var target_temp_height = parseFloat($(this).clone().html('_blank_').appendTo('#temporary_document_resizer_holder').height());
    $('#temporary_document_resizer_holder').remove();

    return target_height == target_temp_height ? target_height : (Math.round(100 * target_height / target_parent_height) + '%');
}

jQuery.fn.fixTables = function () {
    jQuery(this).each(function (index, value) {
        var $table = $(value);
        var $padre = getParentOfTable($table);
        
        //Resetear valores absolutos de ancho de tabla y celda (solo las tablas creadas por ckeditor5, las que no se visualizan con .ck-content).
        //TODO: eliminar estos reset en cuanto todo se cambie a ckeditor5 lo que contínua como ckeditor viejo
        var isNewEditor = $table.closest('.external-content').length ? true : false;
        if (!isNewEditor) {
            $table.removeAttr('border');
            $table.removeAttr('cellpadding');
            $table.removeAttr('cellspacing');
            $table.removeAttr('width');
            $table.find('td').css('border', '1px solid #ddd');
            $table.css('width', '');
            
        } else {
            $table.css('font-size', '');
            $table.find('tr:first-child>td').css('width', '');
        }

        let anchoTabla = $table.width();
        //El ancho del padre hay que redondearlo hacia arriba debido a que en escalas mayores que 100% los bordes ocupan algo menos
        let ancho = Math.ceil($padre.width());
        let em = 1.0;
        
        if (ancho < anchoTabla) {
            if (!isNewEditor) {
                //Cambiar la primera fila a porcentaje
                $table.find('tr:first-child>td').css('width', $table.find('tr:first-child>td').getWidth());
                //Eliminar los anchos de las celdas a partir de la segunda fila.
                $table.find('tr:nth-child(n+2)>td').css('width', '');
            }

            while (ancho < anchoTabla && em > 0.5) {
                em -= .05;
                $table.css('font-size', em + 'em');
                anchoTabla = $(value).width();
            }
        }
    });

    //TODO: Añadir nuevos bloques a la función conforme se creen en el ckeditor.
    function getParentOfTable($table) {
        var bloques = ['.ck-content', '.layout-page-inner', '.layout-twocolumns-1', '.layout-twocolumns-2',
                '.layout-twocolumns-3-1', '.layout-twocolumns-3-2', '.layout-twocolumns-3-3', 'blockquote'];

        //En caso contrario devolver el external-code como padre
        var $ret = $table.closest('.external-code');

        $.each(bloques, function (index, value) {
            //Si está dentro del bloque devolverlo
            if ($table.parents(value).length) $ret = $table.closest(value);
        })

        return $ret;
    }
};

/**
* Función que ordena una tabla pasándole como parámetros el Id de la tabla y el número de la columna empezando en 0
* @param {String} tableId El nombre de la tabla
* @param {Number} columnNumber El número de la columna, empezando en 0
* @param {String} html Si usar html para la comparación. Si es true entonces se usa el innerHTML sino se usa el textContent, por defecto se usa el textContent
*/
function sortTable(tableId, columnNumber, html) {

    var tableElement = document.getElementById(tableId),
        rows,
        switching = true,//Determina si hay que continuar ordenando
        i,
        currentCell,
        nextCell,
        shouldSwitch,//Determina si la celda de la fila actual y de la siguiente hay que alternarlas en posición
        sortOrder = "asc",
        switchcount = 0,
        cellContent = html ?
            function (cell) { return cell ? cell.innerHTML.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : ''; }
            :
            function (cell) {
                return cell ? cell.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : '';
            };

    while (switching) {
        switching = false;
        rows = $(tableElement).find('tr:not(.sin-datos)');

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
            currentCell = rows[i].getElementsByTagName("TD")[columnNumber];
            nextCell = rows[i + 1].getElementsByTagName("TD")[columnNumber];


            if (sortOrder === "asc") {
                if (cellContent(currentCell) > cellContent(nextCell)) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if (sortOrder === "desc") {
                if (cellContent(currentCell) < cellContent(nextCell)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
        else {
            if (switchcount === 0 && sortOrder === "asc") {
                sortOrder = "desc";
                switching = true;
            }
        }
    }

    $('#' + tableId + ' thead th span:last-child')
        .removeClass('icon-gotop')
        .removeClass('icon-gobottom');
    $('#' + tableId + ' thead th:nth-child(' + (parseInt(columnNumber) + 1) + ') span:last-child')
        .addClass('icon-' + (sortOrder === 'asc' ? 'gotop' : 'gobottom'));
}

//Cambia los tamaños de las columnas de la tabla adecuándolos a su índice (c1, c2, ... cN)
//tipos = array de enteros con los distintos tamaños relativos de columnas
function resizeColumns(tipos) {
    var columnas = 0;
    $.each(tipos, function (index, value) {
        columnas += $('thead th.c' + value).length * value;
    });
    $.each(tipos, function (index, value) {
        $('thead th.c' + value + ', tbody td.c' + value).css('width', 100.0 * value / (columnas) + '%');
    });
}


/**
 * Función para eliminar los acentos del texto
 * @param {string} text : texto de entrada
 * @returns {string} : texto sin acentos
 */
function removeAccents(text) {
    var rExps = [
        { re: /[\xE0-\xE6]/g, ch: "a" },
        { re: /[\xE8-\xEB]/g, ch: "e" },
        { re: /[\xEC-\xEF]/g, ch: "i" },
        { re: /[\xF2-\xF6]/g, ch: "o" },
        { re: /[\xF9-\xFC]/g, ch: "u" },
        { re: /[\xC7-\xE7]/g, ch: "c" },
        { re: /[\xF1]/g, ch: "n" }
    ];
    text = text.toLowerCase();
    $.each(rExps, function () {
        text = text.replace(this.re, this.ch);
    });
    return text;
};

function descargarFileDownload(obj, mostrarMensaje) {
    var url = $(obj).data('url');
    $.fileDownload(url, {
        prepareCallback: function (data) {
            verMensaje('<div style="height: 100px;"><p class="lead" style="white-space: nowrap;">El proceso puede durar unos segundos, espere por favor...</p><p style="text-align: center"><img src="/Content/img/loading.svg" style="width: 30px" /></p></div>', {
                buttons: null,
                modal: true
            });
        },
        successCallback: function (data) {
            if (mostrarMensaje)
                verMensajeOK({ mensaje: 'La descarga se ha efectuado correctamente.', onclick: '$.fancybox.close(); return false;' });
            else
                $.fancybox.close();
        },
        failCallback: function (msg) {
            verMensajeError({ mensaje: msg });
        }
    });
    return false;
}

/**
* Sirve una página o fichero directamente al navegador. Siempre por POST.
* @param {string} url: url
* @param {JSON} parameters: json con los parámetros POST que enviar al servidor
* @param {string} target: '_blank', '_self'
*/
function navigateWithPost(url, parameters, target = '_self') {
    var arrayUrl = url.split('?');
    url = arrayUrl[0];
    var frm = jQuery('<form />')
        .prop('action', url)
        .prop('method', 'post')
        .prop('target', target);
    jQuery.each(parameters, function (index, value) {
        jQuery(frm).append(
            jQuery('<input />')
                .prop('type', 'hidden')
                .prop('id', index)
                .prop('name', index)
                .prop('value', value)
        );
    });
    if (arrayUrl.length > 1) {
        var parametros = arrayUrl[1].split('&');
        for (var i = 0; i < parametros.length; i++) {
            var parametro = parametros[i].split('=');
            jQuery(frm).append(
                jQuery('<input />')
                    .prop('type', 'hidden')
                    .prop('id', parametro[0])
                    .prop('name', parametro[0])
                    .prop('value', parametro[1])
            );
        }
    };
    jQuery('body').append(frm);
    jQuery(frm).submit();
}

/**
* Esta función transforma una función en otra que aunque se llame muy rápidamente, sólo se invoca cada {tiempoEspera} millisegundos
* @@param {Function} funcion
* @@param {number} tiempoEspera
*/
function throttle(funcion, tiempoEspera) {
    let self = this;
    let cancelToken = null;

    function funcionModificada(...args) {
        if (cancelToken) {
            clearTimeout(cancelToken);
        }

        cancelToken = setTimeout(() => {
            funcion.apply(self, args);
        }, tiempoEspera);
    }

    return funcionModificada;
}

/**
 * Muestra los errores en una div de tipo callout. Cuando pasan 10 segundos esconde la capa de errores.
 * @param {jQuery} elemento - elemento tipo callout donde se muestran los errrores en formato jQuery.
 * @param {string} mensaje - texto que se va a mostrar
 * */
function showErrorMensaje(elemento, mensaje) {
    elemento.find('.inner p').html(mensaje);
    elemento.show().animate({ opacity: 1 }, 500, function () { window.parent?.$?.fancybox?.update();});
    setTimeout(function () { hideErrorMensaje(elemento, true); }, 10000);
}

/**
 * Oculta los errores en una div de tipo callout en 1 segundo.
 * @param {jQuery} elemento - elemento tipo callout que se va a ocultar en formato jQuery.
 * @param {boolean} animating - indica si se va a animar la ocultación.
 * */
function hideErrorMensaje(elemento, animating) {
    if (animating) {
        elemento.animate({ opacity: 0 }, 1000, function () { elemento.hide(); window.parent?.$?.fancybox?.update(); });
    } else {
        elemento.hide();
    }
}

/**
 * Formatea una fecha al estilo de .NET
 * @param {Date} date - la fecha de javascript que se va a formatear
 * */
function dateTimeToString(date) {
    function getPartValue(parts, type) {
        return parts.find(part => part.type == type).value;
    }
    const dateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('es-ES', dateTimeFormatOptions);
    const parts = formatter.formatToParts(date);
    return `${getPartValue(parts, 'day')}/${getPartValue(parts, 'month')}/${getPartValue(parts, 'year')} ${getPartValue(parts, 'hour')}:${getPartValue(parts, 'minute')}`;
}

/**
* Sanea el valor de un atributo 
* @param {String} value - el texto que se quiere sanear para establecerlo en un atributo
* */
function safeAttributeReplace(value) {
    if (!value) {
        return '';
    }
    const map = [{ source: '&', converted: `&amp;` },
    { source: '<', converted: `&lt;` },
    { source: '>', converted: `&gt;` },
    { source: '"', converted: `&quot;` },
    { source: '\'', converted: `&#x27;` },
    { source: '/', converted: `&#x2F;` }];

    map.forEach(conversion => value = value.replaceAll(conversion.source, conversion.converted));
    return value;
}


/**
 * Realiza la comparación de los valores de una propiedad entre dos objetos. Si los valores son iguales devuelve 0. Si el primero es menor que el segundo devuelve -1, y si es mayor 1.
 * @param {String} property - el nombre de la propiedad de los objetos
 * @param {Object} firstObject - el primer objeto
 * @param {Object} secondObject - el segundo objeto
 * @param {Object} options - opciones de uso
 * @returns {number} - Si los valores son iguales devuelve 0. Si el primero es menor que el segundo devuelve -1, y si es mayor 1.
 * */
function sortObjectProperty(property, firstObject, secondObject, options) {
    let firstValue;
    let secondValue;
    const propertyIsFunction = typeof (property) === 'function';

    try {
        firstValue = propertyIsFunction ? property(firstObject) : firstObject[property];
    } catch (err) {
        firstValue = undefined;
    }

    try {
        secondValue = propertyIsFunction ? property(secondObject) : secondObject[property];
    } catch (err) {
        secondValue = undefined;
    }

    if (firstValue === null) {
        return secondValue === null ? 0 : (secondValue === undefined ? 1 : -1);
    } else if (firstValue === undefined) {
        return secondValue === null ? -1 : (secondValue === undefined ? 0 : -1);
    } else if (secondValue === null || secondValue === undefined) {
        return 1;
    } else {
        if (typeof firstValue === "string" && typeof secondValue === "string" && options.ignoreCaseAccents) {
            return firstValue.localeCompare(secondValue, 'es', { sensitivity: "base" });
        }
        return firstValue < secondValue ? -1 : (firstValue > secondValue ? 1 : 0);
    }
}

/**
 * Crea una función de ordenación para ser pasada como parámetro al método Array.sort(...)
 * @param {String[]|Function[]} - lista de propiedades, o lista de getters o funciones de acceso a propiedades. Si se usan cadenas se permite un nivel. Si se usan funciones se permite cualquier nivel de anidamiento.
 * @param {{descending:boolean}} options - opciones. "descending" que indica si se ordena de manera descendente. Por defecto ordena de manera ascendente. Y ignoreCaseAccents que si es true ignora mayusculas y acentos
 * */
function createSort(properties, options = {}) {
    options = options || {};
    if (options.ignoreCaseAccents === undefined || options.ignoreCaseAccents === null) {
        options.ignoreCaseAccents = true;
    }
    if (!Array.isArray(properties)) {
        properties = [properties];
    }

    return function sortImplementation(firstObject, secondObject) {
        const len = properties.length;
        let i = -1;
        let result;

        while (++i < len) {
            result = sortObjectProperty(properties[i], firstObject, secondObject, options);
            if (result !== 0) {
                break;
            }
        }
        if (options.descending === true) {
            return result * -1;
        }
        return result;
    };
}

