import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';
import { trans } from '@/utils';

export default function Show({ event }) {
    dayjs.locale("es");

    const headerClass = classNames(
        'relative w-full min-h-[55vh] flex items-center bg-cover bg-center'
    );

    return (
        <SiteLayout>
            <Head title={event.title} />
            <div className="w-full overflow-hidden">
                
                <div className={headerClass} style={{ backgroundImage: `url("${event.image}")` }}>
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto px-4 md:px-10 py-12 md:py-10 gap-10">
                        
                        <div className="flex flex-col items-center md:items-start text-white w-full md:w-3/5 break-words">
                            
                            <h1 className="text-3xl md:text-5xl font-extrabold text-center md:text-left mb-6 leading-tight">
                                {event.title}
                            </h1>

                            <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 text-lg'>
                                <i className="fa-solid fa-calendar-days text-white-400"></i>
                                {event.start !== event.end ? (
                                    <div className="flex items-center gap-2">
                                        <span>{dayjs(event.start).format('DD MMM YYYY')}</span>
                                        <i className="fa-solid fa-arrows-left-right text-xs opacity-50"></i>
                                        <span>{dayjs(event.end).format('DD MMM YYYY')}</span>
                                    </div>
                                ) : (
                                    <span>{dayjs(event.start).format('DD MMM YYYY')}</span>
                                )}
                            </div>

                            <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-lg'>
                                {event.is_online ? (
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-globe text-white-400"></i>
                                        <span>Evento Online</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-stone-200">
                                        <i className="fa-solid fa-location-dot text-white-400"></i>
                                        <span className="text-center md:text-left">
                                            {event.address}
                                            {event.city?.name ? `, ${event.city.name}` : ''}
                                            {event.city?.state?.name ? `, ${event.city.state.name}` : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
                            <img 
                                src={event.image} 
                                alt={event.title} 
                                className="rounded-xl shadow-2xl max-h-[50vh] object-contain border border-white/10" 
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-10 max-w-6xl mx-auto px-5 pt-12 pb-20'>
                    
                    <div className='w-full md:w-2/3 break-words'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                            Descrição do evento
                        </h2>
                        <div 
                            className="prose prose-stone max-w-none text-gray-600 leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: event.description }} 
                        />
                    </div>

                    <div className='w-full md:w-1/3 mt-8 md:mt-0'>
                        <div className='bg-white md:border md:border-gray-100 rounded-xl md:shadow-lg sticky top-5 overflow-hidden'>
                            
                            <div className='bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3 font-bold text-gray-800'>
                                {event.is_online ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                        <h3>Acesso Digital</h3>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-location-dot text-blue-400"></i>
                                        <h3>Localização</h3>
                                    </>
                                )}
                            </div>
                            
                            <div className='p-6'>
                                {event.is_online ? (
                                    <div className="space-y-6 text-center md:text-left">
                                        <p className='text-gray-600 text-sm leading-relaxed'>
                                            Este evento será realizado de forma digital. Clique no botão abaixo para ser redirecionado ao link oficial de participação.
                                        </p>
                                        <a 
                                            href={event.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition-all shadow-md group"
                                        >
                                            <span>Ir para o evento</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className='text-gray-600 text-sm leading-relaxed font-medium'>
                                            {event.address}
                                            {event.city?.name ? `, ${event.city.name}` : ''}
                                            {event.city?.state?.name ? `, ${event.city.state.name}` : ''}
                                        </p>
                                        {event.google_maps_src && (
                                            <div className='w-full h-[250px] rounded-lg overflow-hidden border border-gray-200'>
                                                <iframe 
                                                    className="w-full h-full" 
                                                    src={event.google_maps_src} 
                                                    title="Mapa" 
                                                    loading="lazy"
                                                ></iframe>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SiteLayout>
    );
}