--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attribute_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attribute_values (
    id integer NOT NULL,
    attribute_name_id integer NOT NULL,
    attribute_value character varying(255) NOT NULL
);


ALTER TABLE public.attribute_values OWNER TO postgres;

--
-- Name: attribute_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attribute_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attribute_values_id_seq OWNER TO postgres;

--
-- Name: attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attribute_values_id_seq OWNED BY public.attribute_values.id;


--
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    id integer NOT NULL,
    category_name_id integer NOT NULL,
    attribute character varying(255) NOT NULL
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attributes_id_seq OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_id_seq OWNED BY public.attributes.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    user_id integer NOT NULL,
    brand_name character varying(255) NOT NULL,
    brand_img character varying(400) DEFAULT NULL::character varying,
    brand_description character varying(400) DEFAULT NULL::character varying
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    master_category_name_id integer NOT NULL,
    category_name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: master_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_categories (
    id integer NOT NULL,
    master_category_name character varying(255) NOT NULL
);


ALTER TABLE public.master_categories OWNER TO postgres;

--
-- Name: master_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.master_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.master_categories_id_seq OWNER TO postgres;

--
-- Name: master_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.master_categories_id_seq OWNED BY public.master_categories.id;


--
-- Name: product_imgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_imgs (
    id integer NOT NULL,
    product_id integer NOT NULL,
    img_url character varying(255) NOT NULL,
    is_main boolean DEFAULT false
);


ALTER TABLE public.product_imgs OWNER TO postgres;

--
-- Name: prodcut_imgs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prodcut_imgs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prodcut_imgs_id_seq OWNER TO postgres;

--
-- Name: prodcut_imgs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prodcut_imgs_id_seq OWNED BY public.product_imgs.id;


--
-- Name: producers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producers (
    id integer NOT NULL,
    producer_name character varying(255) NOT NULL
);


ALTER TABLE public.producers OWNER TO postgres;

--
-- Name: producers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producers_id_seq OWNER TO postgres;

--
-- Name: producers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producers_id_seq OWNED BY public.producers.id;


--
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_attributes (
    product_id integer NOT NULL,
    attribute_value_id integer NOT NULL
);


ALTER TABLE public.product_attributes OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    brand_name_id integer NOT NULL,
    price integer NOT NULL,
    date_registered timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    category_name_id integer NOT NULL,
    description character varying(600) DEFAULT NULL::character varying,
    producer_id integer NOT NULL,
    CONSTRAINT products_price_check CHECK ((price >= 0))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    registration_date timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    is_seller boolean DEFAULT false,
    profile_img character varying(400) DEFAULT NULL::character varying,
    shipping_address character varying(400) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attribute_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values ALTER COLUMN id SET DEFAULT nextval('public.attribute_values_id_seq'::regclass);


--
-- Name: attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes ALTER COLUMN id SET DEFAULT nextval('public.attributes_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: master_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_categories ALTER COLUMN id SET DEFAULT nextval('public.master_categories_id_seq'::regclass);


--
-- Name: producers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producers ALTER COLUMN id SET DEFAULT nextval('public.producers_id_seq'::regclass);


--
-- Name: product_imgs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_imgs ALTER COLUMN id SET DEFAULT nextval('public.prodcut_imgs_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attribute_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attribute_values (id, attribute_name_id, attribute_value) FROM stdin;
4	2	USB
8	4	Bluetooth
1	1	Механическая
2	1	Оптическая
3	1	Мембранная
5	3	Офисная
6	3	Игровая
7	4	Нет
9	5	PCI Express x16
10	5	AGP
11	6	4 GB
12	6	8 GB
13	6	16 GB
14	7	GDDR5
15	7	GDDR6
16	8	1500 MHz
17	8	1800 MHz
18	8	2000 MHz
19	9	7000 MHz
20	9	8000 MHz
21	10	2048
22	10	3072
23	10	4096
24	11	3840x2160
25	11	7680x4320
26	12	Ray Tracing
27	12	DLSS
28	12	NVIDIA G-SYNC
29	13	150W
30	13	250W
31	14	Воздушное
32	14	Жидкостное
33	15	Воздушное
34	15	Жидкостное
35	16	120 мм
36	16	140 мм
37	17	1
38	17	2
39	18	LGA 1151
40	18	AM4
41	19	1500 RPM
42	19	2000 RPM
43	20	25 дБ
44	20	35 дБ
45	21	Алюминий
46	21	Медь
47	22	150 Вт
48	22	200 Вт
49	23	120x120 мм
50	23	140x140 мм
51	24	Белый
52	24	RGB
53	26	PCI-E
54	27	500W
55	27	600W
56	27	750W
57	27	1000W
58	28	ATX
59	28	SFX
60	29	80 Plus Bronze
61	29	80 Plus Silver
62	29	80 Plus Gold
63	29	80 Plus Platinum
64	30	1
65	30	2
66	30	3
67	31	20A
68	31	30A
69	31	40A
70	32	12V
71	32	5V
72	32	3.3V
73	33	120mm
74	33	140mm
75	33	80mm
76	34	20 dB
77	34	30 dB
78	34	40 dB
79	35	30 cm
80	35	40 cm
81	35	50 cm
82	36	RGB
83	36	Одноцветная
84	37	Да
85	37	Нет
86	38	Да
87	38	Нет
88	39	Да
89	39	Нет
90	40	Мультимедийные клавиши
91	40	Микрофон
92	41	Полноразмерная
93	41	Компактная
94	42	Пластик
95	42	Металл
96	43	USB
97	43	Bluetooth
98	44	Мониторная
99	44	Эргономичная
100	45	1600
101	45	3200
102	46	3
103	46	5
104	47	Есть
105	47	Отсутствует
106	48	Да
107	48	Нет
108	49	1.5 м
109	49	2 м
110	50	Да
111	50	Нет
112	51	1 мс
113	51	2 мс
114	52	Нет
115	52	Bluetooth
116	54	Накладные
117	54	Вкладыши
118	55	Динамический
119	55	Арматурный
120	56	20 Гц - 20 кГц
121	56	10 Гц - 40 кГц
122	57	32 Ом
123	57	64 Ом
124	58	98 дБ
125	58	100 дБ
126	59	Да
127	59	Нет
128	60	Да
129	60	Нет
130	61	Нет
131	61	Bluetooth
132	62	10 часов
133	62	20 часов
136	64	150-200 л
137	64	200-250 л
138	64	250-300 л
139	65	50-100 л
140	65	100-150 л
141	65	150-200 л
142	66	Отдельно стоящий
143	66	Встраиваемый
144	67	A+
145	67	A++
146	67	A+++
147	68	1
148	68	2
149	68	3
150	69	No Frost
151	69	Капельная
152	70	Механическое
153	70	Электронное
154	71	Да
155	71	Нет
156	72	до 40 дБ
157	72	40-50 дБ
158	72	50-60 дБ
159	73	Настенный
160	73	Кассетный
161	73	Напольный
162	74	3 кВт
163	74	5 кВт
164	74	7 кВт
165	75	3.5 кВт
166	75	5.5 кВт
167	75	7.5 кВт
168	76	R-32
169	76	R-410A
170	77	20 м²
171	77	40 м²
172	77	60 м²
173	78	A++
174	78	A+++
175	79	25 дБ
176	79	35 дБ
177	79	45 дБ
178	80	Да
179	80	Нет
180	81	Механический фильтр
181	81	Угольный фильтр
182	81	HEPA фильтр
183	82	Да
184	82	Нет
185	83	Да
186	83	Нет
187	84	Соло
188	84	С комбинированным типом
189	84	С грилем
190	84	С конвекцией
191	85	700 Вт
192	85	800 Вт
193	85	900 Вт
194	85	1000 Вт
195	86	15 л
196	86	20 л
197	86	25 л
198	86	30 л
199	87	Механическое
200	87	Сенсорное
201	87	Тактильное
202	87	Цифровое
203	88	Есть
204	88	Нет
205	89	Есть
206	89	Нет
207	90	Есть
208	90	Нет
209	91	5
210	91	7
211	91	10
212	91	15
213	92	Эмаль
214	92	Нержавеющая сталь
215	92	Керамическое покрытие
216	93	Автоприготовление
217	93	Размораживание
218	93	Гриль и конвекция
219	93	Подогрев пищи
220	94	Эпилятор
221	94	Триммер
222	94	Машинка для стрижки
223	94	Увлажнитель воздуха
224	95	Для лица
225	95	Для тела
226	95	Универсальное
227	95	Для волос
228	96	Нет
229	96	Bluetooth
230	97	1
231	97	2
232	97	3
233	98	5 Вт
234	98	10 Вт
235	98	15 Вт
236	99	Механический фильтр
237	99	Угольный фильтр
238	99	HEPA фильтр
239	100	Компактный
240	100	Угловой
241	100	Классический
242	101	500 г
243	101	1 кг
244	101	1.5 кг
245	102	Защита от перегрева
246	102	Автоотключение
247	102	Ночной режим
248	103	Цитрусовый
249	103	Лаванда
250	103	Мятный
251	103	Нет
252	104	Термопаста
253	105	5 г
254	105	10 г
255	105	20 г
256	106	3 года
257	106	5 лет
258	107	От -50°C до +150°C
259	107	От -60°C до +200°C
260	108	Паста
261	108	Гель
262	109	Кремний
263	109	Медь
264	110	1 минута
265	110	3 минуты
266	111	Высокая
267	111	Средняя
268	112	Intel
269	112	AMD
270	113	2%
271	113	5%
272	114	Коврик для мыши
273	114	Подставка для ноутбука
274	114	Чехол для клавиатуры
275	115	Резина
276	115	Ткань
277	115	Пластик
278	116	L
279	116	M
280	116	S
281	117	Гладкая
282	117	Текстурированная
283	117	Перфорированная
284	118	Есть
285	118	Нет
286	119	Нет
287	119	Bluetooth
288	120	ПК
289	120	Ноутбук
290	120	Смартфон
291	121	Есть
292	121	Нет
293	122	Черный
294	122	Синий
295	122	Красный
296	124	ATX
297	123	Имеется
298	123	Нет
299	124	Micro ATX
300	124	Mini ITX
301	125	Intel Z490
302	125	AMD B550
303	126	Intel Core i9
304	126	AMD Ryzen 9
305	127	2
306	127	4
307	128	PCI Express 3.0
308	128	PCI Express 4.0
309	129	USB 3.0
310	129	USB Type-C
311	130	Да
312	131	Активное
313	131	Пассивное
314	132	RAID 0
315	132	RAID 1
316	132	RAID 5
317	133	Да
318	134	Wi-Fi 6
319	135	Да
320	134	DDR4
321	134	DDR3
322	135	8 GB
323	135	16 GB
324	135	32 GB
325	136	2133 MHz
326	136	2400 MHz
327	136	3000 MHz
328	137	Single Channel
329	137	Dual Channel
330	138	CL15
331	138	CL16
332	138	CL18
333	139	Да
334	139	Нет
335	140	1.2V
336	140	1.35V
337	141	Активное
338	141	Пассивное
339	142	Да
340	142	Нет
341	143	DIMM
342	143	SO-DIMM
343	144	4
344	144	6
345	144	8
346	144	12
347	145	3.5 GHz
348	145	4.0 GHz
349	145	4.5 GHz
350	146	12 MB
351	146	16 MB
352	146	20 MB
353	147	Да
354	147	Нет
355	148	95W
356	148	105W
357	148	125W
358	149	LGA 1151
359	149	LGA 1200
360	149	AM4
361	150	Да
362	150	Нет
363	151	Intel SpeedStep
364	151	AMD CoolQuiet
365	152	2
366	152	4
367	153	HDMI
368	153	USB-C
369	153	Ethernet
370	153	DisplayPort
371	154	1 м
372	154	2 м
373	154	3 м
374	154	5 м
375	155	ПВХ
376	155	Тефлон
377	155	Неопрен
378	155	Кевлар
379	156	2
380	156	4
381	156	6
382	156	8
383	157	USB-A
384	157	USB-C
385	157	RJ45
386	157	HDMI
387	158	Да
388	158	Нет
389	159	10 Гбит/с
390	159	5 Гбит/с
391	159	1 Гбит/с
392	159	100 Мбит/с
393	160	Да
394	160	Нет
395	161	5 В
396	161	12 В
397	161	24 В
398	161	48 В
399	162	Для зарядки
400	162	Для передачи данных
401	162	Для питания
402	162	Для видео- и аудиопередачи
403	163	HDD
404	163	SSD
405	164	120 GB
406	164	240 GB
407	164	500 GB
408	164	1 TB
409	165	500 MB/s
410	165	550 MB/s
411	165	1200 MB/s
412	166	450 MB/s
413	166	500 MB/s
414	166	1000 MB/s
415	167	SATA III
416	167	NVMe
417	168	2.5 inch
418	168	3.5 inch
419	168	M.2
420	169	5400 RPM
421	169	7200 RPM
422	170	Нет
423	170	256 MB
424	170	512 MB
425	171	Нет
426	171	Да
427	172	RGB
428	172	Белая
429	172	Синий
430	172	Многоцветная
431	173	1500 Лм
432	173	1000 Лм
433	173	1200 Лм
434	174	3000 K
435	174	5000 K
436	174	6000 K
437	175	Да
438	175	Нет
439	176	Быстрая
440	176	Средняя
441	176	Медленная
442	177	USB
443	177	Беспроводное
444	177	Bluetooth
445	178	Да
446	178	Нет
447	179	1
448	179	2
449	179	3
450	180	Да
451	180	Нет
452	181	Нет
453	181	Bluetooth
454	182	Windows
455	182	PlayStation
456	182	Nintendo Switch
457	183	Да
458	183	Нет
459	184	USB
460	184	Bluetooth
461	185	12
462	185	16
463	185	8
464	186	Подсветка
465	186	Программируемые кнопки
466	186	Аудиовыход
467	187	Эргономичная форма
468	187	Компактная форма
469	188	Да
470	188	Нет
471	189	Да
472	189	Нет
475	191	USB 3.0
476	191	USB 3.1
477	191	USB-C
478	192	256 GB
479	192	512 GB
480	192	1 TB
473	190	Флешка
481	192	2 TB
482	193	500 MB/s
483	193	1000 MB/s
484	193	1500 MB/s
485	194	450 MB/s
486	194	850 MB/s
487	194	1200 MB/s
488	195	2.5-inch
489	195	3.5-inch
490	196	Да
491	196	Нет
492	197	Windows
493	197	macOS
494	197	Linux
495	198	1 год
496	198	2 года
497	198	3 года
498	199	Защита от перегрева
499	199	Подключение к облачному сервису
500	199	Автоматическое резервное копирование
501	200	Конденсаторный
502	200	Динамический
503	200	Лавальерный
504	201	20 Гц - 20 кГц
505	201	50 Гц - 16 кГц
506	201	40 Гц - 18 кГц
507	202	95 дБ
508	202	100 дБ
509	202	98 дБ
510	203	32 Ом
511	203	250 Ом
512	203	150 Ом
513	204	USB
514	204	XLR
515	204	3.5 мм
516	205	Нет
517	205	Bluetooth
518	206	Да
519	206	Нет
520	207	Да
521	207	Нет
522	208	Да
523	208	Нет
524	209	16 мм
525	209	20 мм
526	209	18 мм
527	210	Да
528	210	Нет
529	211	Лазерный
530	211	Струйный
531	212	A4
532	212	A3
533	213	1000
534	213	3000
535	213	5000
536	214	Да
537	214	Нет
538	215	20 стр/мин
539	215	30 стр/мин
540	215	40 стр/мин
541	216	Да
542	216	Нет
543	217	1
544	217	2
545	217	4
546	218	Да
547	218	Нет
548	219	Тачскрин
549	219	Кнопки
550	219	Пульт дистанционного управления
551	220	1 год
552	220	2 года
553	220	3 года
554	221	Портативные
555	221	Настольные
556	221	Напольные
557	222	5 Вт
558	222	10 Вт
559	222	20 Вт
560	222	50 Вт
561	223	Нет
562	223	Bluetooth
563	224	20 Гц - 20 кГц
564	224	30 Гц - 20 кГц
565	225	Пульт дистанционного управления
566	225	Мобильное приложение
567	225	Голосовое управление
568	226	Нет
569	226	Есть
570	227	1 год
571	227	2 года
572	227	3 года
573	228	Пластик
574	228	Дерево
575	228	Металл
576	229	3.5 мм джек
577	229	Bluetooth
578	229	USB
579	230	Нет
580	230	Есть
581	231	LED
582	231	OLED
583	231	QLED
584	231	VA
585	231	1920x1080
586	231	2560x1440
587	231	3840x2160
588	233	60 Hz
589	233	120 Hz
590	233	144 Hz
591	233	240 Hz
592	234	21.5"
593	234	24"
594	234	27"
595	234	32"
596	235	HDMI
597	235	DisplayPort
598	235	USB-C
599	235	VGA
600	236	HDR10
601	236	Dolby Vision
602	236	HLG
603	237	178°
604	237	170°
605	237	160°
606	238	250 cd/m²
607	238	300 cd/m²
608	238	400 cd/m²
609	238	600 cd/m²
610	239	Нет
611	239	Bluetooth
612	240	USB-C
613	240	HDMI
614	241	2160x1200
615	241	2880x1600
616	242	90 Hz
617	242	120 Hz
618	243	1
619	243	2
620	244	Да
621	244	Нет
622	245	Да
623	245	Нет
624	246	PC
625	246	PS5
626	246	Xbox
627	247	110°
628	247	120°
629	248	Бинокулярные
630	248	Монокулярные
631	249	4 ч
632	249	6 ч
633	250	Электрическая
634	250	Газовая
635	251	2
636	251	4
637	251	6
638	252	Да
639	252	Нет
640	253	Да
641	253	Нет
642	254	Стеклокерамика
643	254	Нержавеющая сталь
644	254	Чугун
645	255	Да
646	255	Нет
647	256	Механическое
648	256	Сенсорное
649	257	800-1500 Вт
650	257	1500-2500 Вт
651	257	2500-3500 Вт
652	258	Сетевое
653	258	Газовое
654	259	Фронтальная
655	259	Вертикальная
656	260	5 кг
657	260	7 кг
658	260	8 кг
659	260	10 кг
660	261	A
661	261	B
662	261	C
663	262	Да
664	262	Нет
665	263	15
666	263	20
667	263	25
668	264	Механическое
669	264	Сенсорное
670	265	A+++
671	265	A++
672	265	A+
673	266	Сетевое
674	266	Wi-Fi
675	267	Да
676	267	Нет
677	268	Конвектор
678	268	Масляный обогреватель
679	268	Тепловентилятор
680	269	1000 Вт
681	269	1500 Вт
682	269	2000 Вт
683	269	2500 Вт
684	270	10 м²
685	270	15 м²
686	270	20 м²
687	271	Механическое
688	271	Электронное
689	271	Дистанционное управление через приложение
690	272	Есть
691	272	Нет
692	273	Есть
693	273	Нет
694	274	Сетевое
695	274	Беспроводное
696	275	3 кг
697	275	5 кг
698	275	7 кг
699	276	50 дБ
700	276	60 дБ
701	276	70 дБ
702	277	Вертикальный
703	277	Робот-пылесос
704	277	Пылесос с мешком
705	277	Пылесос без мешка
706	278	200 Вт
707	278	350 Вт
708	278	500 Вт
709	278	600 Вт
710	279	HEPA
711	279	Циклонный
712	279	Аквафильтр
713	280	Да
714	280	Нет
715	281	A
716	281	A+
717	281	A++
718	282	4 кг
719	282	6 кг
720	282	8 кг
721	283	Сетевой
722	283	Аккумуляторный
723	283	Комбинированный
724	284	0.5 л
725	284	1 л
726	284	2 л
727	285	Да
728	285	Нет
729	286	60 дБ
730	286	70 дБ
731	286	80 дБ
\.


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (id, category_name_id, attribute) FROM stdin;
94	10	Тип устройства
95	10	Область применения
96	10	Тип беспроводного подключения
97	10	Количество насадок или щеток
1	4	Тип структуры
2	4	Интерфейс подключения
3	4	Тип
4	4	Тип беспроводного подключения
5	1	Интерфейс подключения
6	1	Объем видеопамяти
7	1	Тип памяти
8	1	Частота графического процессора
9	1	Частота памяти
10	1	Количество ядер CUDA
11	1	Максимальное разрешение
12	1	Поддержка технологий
13	1	Энергопотребление
14	1	Тип охлаждения
15	2	Тип охлаждения
16	2	Диаметр вентилятора
17	2	Количество вентиляторов
18	2	Совместимость с сокетами
19	2	Максимальная скорость вращения вентилятора
20	2	Уровень шума
21	2	Материал радиатора
22	2	Максимальный тепловой поток
23	2	Размер радиатора
24	2	Цвет подсветки
25	2	Интерфейс подключения
26	3	Интерфейс подключения
27	3	Мощность
28	3	Тип подключения
29	3	Сертификация эффективности
30	3	Количество линий питания +12V
31	3	Максимальный ток на линии +12V
32	3	Напряжение на выходе
33	3	Размер вентилятора
34	3	Уровень шума
35	3	Длина кабелей
36	4	Тип подсветки
37	4	Поддержка Anti-Ghosting
38	4	Поддержка программируемых клавиш
39	4	Наличие цифровой панели
40	4	Наличие дополнительной функциональности
41	4	Размер клавиатуры
42	4	Материал корпуса
43	5	Интерфейс подключения
44	5	Тип структуры
45	5	Максимальный DPI
46	5	Количество кнопок
47	5	Подсветка
48	5	Поддержка программируемых кнопок
49	5	Длинна кабеля
50	5	Наличие колесика прокрутки
51	5	Скорость отклика
52	5	Тип беспроводного подключения
53	6	Интерфейс подключения
54	6	Тип наушников
55	6	Тип драйвера
56	6	Частотный диапазон
57	6	Импеданс
58	6	Чувствительность
59	6	Наличие активного шумоподавления
60	6	Наличие микрофона
61	6	Тип беспроводного подключения
62	6	Время работы (для беспроводных наушников)
63	7	Наличие функции охлаждения напитков
64	7	Объем холодильной камеры
65	7	Объем морозильной камеры
66	7	Тип установки
67	7	Класс энергоэффективности
68	7	Количество камер
69	7	Система охлаждения
70	7	Тип управления
71	7	Наличие водяного фильтра
72	7	Уровень шума
73	8	Тип установки
74	8	Мощность охлаждения
75	8	Мощность обогрева
76	8	Тип хладагента
77	8	Площадь помещения, м²
78	8	Энергоэффективность
79	8	Уровень шума
80	8	Наличие Wi-Fi управления
81	8	Тип фильтрации
82	8	Наличие осушителя воздуха
83	8	Горячий воздух
84	9	Тип
85	9	Мощность
86	9	Объем камеры
87	9	Тип управления
88	9	Наличие гриля
89	9	Наличие конвекции
90	9	Наличие дисплея
91	9	Количество уровней мощности
92	9	Тип покрытия камеры
93	9	Поддержка разных функций
98	10	Уровень мощности
99	10	Тип фильтрации
100	10	Размер и форма устройства
101	10	Вес устройства
102	10	Дополнительная функциональность
103	10	Запах
104	11	Тип
105	11	Объем упаковки
106	11	Срок годности
107	11	Температурный диапазон
108	11	Консистенция
109	11	Материал
110	11	Время высыхания
111	11	Устойчивость к перегреву
112	11	Совместимость с типами процессоров
113	11	Температурный коэффициент сопротивления
114	12	Тип аксессуара
115	12	Материал
116	12	Размер
117	12	Тип поверхности
118	12	Наличие подсветки
119	12	Тип беспроводного подключения
120	12	Совместимость с устройствами
121	12	Наличие антискользящей основы
122	12	Цвет и дизайн
123	12	Гарантия
124	13	Форм-фактор
125	13	Чипсет
126	13	Поддержка процессоров
127	13	Количество слотов для ОЗУ
128	13	Подключение для видеокарт
129	13	Наличие USB портов
130	13	Поддержка NVMe накопителей
131	13	Тип охлаждения
132	13	Поддержка RAID
133	13	Наличие встроенной звуковой карты
134	14	Тип ОЗУ
135	14	Объем памяти
136	14	Частота памяти
137	14	Номера каналов
138	14	Время задержки
139	14	Наличие RGB подсветки
140	14	Напряжение
141	14	Тип охлаждения
142	14	Поддержка XMP профилей
143	14	Форм-фактор
144	15	Количество ядер
145	15	Тактовая частота
146	15	Кэш
147	15	Поддержка многозадачности
148	15	Тепловыделение
149	15	Сокет
150	15	Поддержка разгона
151	15	Технологии энергосбережения
152	15	Количество ядер для графики
153	16	Тип кабеля
154	16	Длина кабеля
155	16	Материал оболочки кабеля
156	16	Количество проводников
157	16	Тип разъемов
158	16	Поддержка высокоскоростной передачи данных
159	16	Скорость передачи данных
160	16	Наличие защиты от помех
161	16	Максимальное напряжение
162	16	Назначение
163	17	Тип накопителя
164	17	Объем памяти
165	17	Скорость чтения
166	17	Скорость записи
167	17	Интерфейс подключения
168	17	Форм-фактор
169	17	Скорость вращения
170	17	Наличие кэш-памяти
171	17	Наличие защиты от перегрева
172	18	Тип подсветки
173	18	Яркость
174	18	Цветовая температура
175	18	Регулировка яркости
176	18	Скорость изменения цвета
177	18	Тип подключения
178	18	Поддержка синхронизации
179	18	Количество LED полос
180	18	Наличие защитных функций от перегрева
181	20	Тип беспроводного подключения
182	20	Совместимость
183	20	Наличие вибрации
184	20	Интерфейс подключения
185	20	Количество кнопок
186	20	Наличие дополнительной функциональности)
187	20	Размер и форма
188	20	Регулировка чувствительности
189	20	Наличие программируемых кнопок
190	21	Тип накопителя
191	21	Интерфейс подключения
192	21	Объем памяти
193	21	Скорость чтения
194	21	Скорость записи
195	21	Форм-фактор
196	21	Наличие аппаратного шифрования
197	21	Совместимость с ОС
198	21	Гарантия
199	21	Дополнительные функции
200	22	Тип микрофона
201	22	Частотный диапазон
202	22	Чувствительность
203	22	Импеданс
204	22	Интерфейс подключения
205	22	Тип беспроводного подключения
206	22	Наличие антипоп-фильтра
207	22	Наличие крепления/штатива
208	22	Наличие шумоподавления
209	22	Размер диафрагмы
210	22	Кабель в комплекте
211	23	Тип принтера
212	23	Формат печати
213	23	Ресурс печати (страниц)
214	23	Наличие Wi-Fi подключения
215	23	Скорость печати
216	23	Поддержка цветной печати
217	23	Количество картриджей
218	23	Наличие автоподатчика
219	23	Тип управления
220	23	Гарантия
221	24	Тип колонок
222	24	Мощность
223	24	Тип беспроводного подключения
224	24	Частотный диапазон
225	24	Система управления (пульт, приложение)
226	24	Наличие микрофона
227	24	Гарантия
228	24	Материал корпуса
229	24	Интерфейс подключения
230	24	Наличие подсветки
231	25	Разрешение
232	25	Тип экрана
233	25	Частота обновления
234	25	Размер экрана
235	25	Интерфейс подключения
236	25	Поддержка HDR
237	25	Углы обзора
238	25	Яркость
239	26	Тип беспроводного подключения
240	26	Интерфейс подключения
241	26	Разрешение экрана
242	26	Частота обновления
243	26	Количество сенсоров
244	26	Наличие встроенных наушников
245	26	Поддержка движения
246	26	Совместимость с платформами
247	26	Угол обзора
248	26	Тип линз
249	26	Время работы
250	27	Тип плиты
251	27	Количество конфорок
252	27	Наличие духовки
253	27	Наличие таймера
254	27	Материал поверхности
255	27	Наличие защиты от перегрева
256	27	Тип управления
257	27	Энергопотребление
258	27	Подключение
259	28	Тип машины
260	28	Объем барабана
261	28	Класс стирки
262	28	Наличие отжима
263	28	Количество программ стирки
264	28	Тип управления (механическое, сенсорное)
265	28	Энергопотребление
266	28	Тип подключения
267	28	Наличие функций защиты от детей
268	29	Тип обогревателя
269	29	Мощность
270	29	Площадь обогрева
271	29	Тип управления
272	29	Наличие термостата
273	29	Наличие фильтров
274	29	Тип подключения
275	29	Вес
276	29	Уровень шума
277	30	Тип пылесоса
278	30	Мощность всасывания
279	30	Тип фильтрации
280	30	Наличие дополнительных насадок
281	30	Энергоэффективность
282	30	Вес
283	30	Тип подключения
284	30	Объем пылесборника
285	30	Наличие функции самоочистки
286	30	Уровень шума
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, user_id, brand_name, brand_img, brand_description) FROM stdin;
18	32	Coretech	/images/2ca4e2ef-9b52-45a9-b3ae-01d52012d56b.png	Coretech — это бренд, специализирующийся на современной внешней периферии: клавиатур, мышек, наушников, колонок и мониторов. Мы продаем устройства, которые обеспечивают комфорт, надежность и максимальную производительность в любой задаче.
19	33	Housepro	/images/9beca2cd-1715-4306-bf00-f10370d5bcf4.png	Housepro — это надёжный поставщик современной бытовой техники от ведущих мировых производителей. Мы специализируемся на продаже стиральных машин, микроволновых печей, пылесосов, сплит-систем и других устройств, обеспечивающих комфорт в доме. Housepro — это минимализм в обслуживании, простота в выборе и доверие в каждом товаре.
20	34	Tekora	/images/2427a6b1-827f-4cac-b8dd-b9400da841a8.png	Tekora — это бренд, специализирующийся на продаже высококачественных приборов для ухода, расходных материалов, таких как термопаста, и аксессуаров для устройств. Мы предлагаем продукцию, которая помогает улучшить работу техники и повысить комфорт в использовании. Наши товары от проверенных производителей гарантируют надежность и долговечность.
17	31	Maximum	/images/ad315f2a-e7b2-4a62-aebe-265355f33f4c.png	Maximum — бренд, специализирующийся на продаже высококачественной внутренней компьютерной периферии: видеокарт, процессоров, материнских плат, кулеров и другого железа для энтузиастов и профессионалов. Мы предлагаем только проверенные решения, сочетающие мощность, надёжность и стиль в духе киберпанка.
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, master_category_name_id, category_name) FROM stdin;
2	1	Кулеры
3	1	Блоки питания
4	2	Клавиатуры
5	2	Компьютерные мыши
6	2	Наушники
7	3	Холодильники
8	3	Сплит-системы
9	3	Микроволновки
1	1	Видеокарты
13	1	Материнские платы
14	1	Оперативная память
15	1	Центральные процессоры
16	1	Провода
17	1	Накопители
18	1	Подсветка
20	2	Геймпады
21	2	Внешние накопители
22	2	Микрофоны
23	2	Принтеры
24	2	Колонки
25	2	Мониторы и телевизоры
26	2	VR-гарнитуры
10	4	Приборы ухода
11	4	Расходные материалы
12	4	Аксессуары для устройств
27	3	Кухонные плиты
28	3	Стиральные машины
29	3	Обогреватели
30	3	Пылесосы
\.


--
-- Data for Name: master_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.master_categories (id, master_category_name) FROM stdin;
1	Внутренняя периферия
2	Внешняя периферия
3	Бытовая техника
4	Разное
\.


--
-- Data for Name: producers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producers (id, producer_name) FROM stdin;
1	Logitec
2	Razer
3	Corsair
4	MSI
5	Asus
6	Gigabyte
7	Thermaltake
8	Nvidia
9	Samsung
10	LG
11	Bosch
12	Philips
13	Panasonic
14	Siemens
15	Dell
16	Creative
17	SanDisk
18	Anker
19	Targus
20	Xiaomi
21	Dyson
22	Intel
23	BarraCuda 
24	Wowled
25	Defender
26	Sony
27	Oculus
28	Redragon
29	Microsoft
30	Kingston
31	Fifine
32	Canon 
\.


--
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_attributes (product_id, attribute_value_id) FROM stdin;
23	136
23	139
23	142
23	144
23	147
23	150
23	152
23	154
23	157
24	137
24	140
24	143
24	145
24	148
24	151
24	153
24	154
24	156
25	138
25	141
25	143
25	145
25	148
25	151
25	153
25	154
25	158
26	159
26	162
26	165
26	168
26	170
26	174
26	175
26	178
26	180
26	183
26	185
27	159
27	163
27	165
27	168
27	170
27	173
27	175
27	178
27	182
27	183
27	185
28	159
28	162
28	165
28	168
28	170
28	173
28	175
28	178
28	182
28	183
28	185
29	633
29	635
29	638
29	640
29	642
29	645
29	647
29	649
29	652
30	654
30	656
30	660
30	663
30	665
30	668
30	672
30	673
30	675
31	654
31	656
31	660
31	663
31	665
31	669
31	670
31	673
31	675
32	677
32	680
32	684
32	690
32	688
32	692
32	694
32	696
32	699
33	702
33	706
33	710
33	714
33	715
33	718
33	722
33	724
33	727
33	730
34	187
34	191
34	195
34	200
34	203
34	205
34	207
34	209
34	215
34	217
35	252
35	253
35	256
35	258
35	260
35	262
35	264
35	266
35	268
35	271
36	252
36	254
36	256
36	258
36	260
36	262
36	264
36	266
36	268
36	270
37	272
37	275
37	278
37	281
37	285
37	286
37	288
37	291
37	293
37	297
38	223
38	226
38	228
38	230
38	233
38	236
38	239
38	242
38	245
38	248
39	33
39	35
39	37
39	39
39	41
39	43
39	45
39	47
39	49
39	51
40	53
40	54
40	58
40	61
40	65
40	68
40	71
40	74
40	76
40	79
41	53
41	55
41	58
41	60
41	65
41	68
41	72
41	74
41	77
41	80
42	53
42	55
42	59
42	62
42	66
42	69
42	70
42	74
42	78
42	81
43	9
43	12
43	15
43	18
43	20
43	22
43	24
43	28
43	29
43	31
44	9
44	13
44	15
44	17
44	19
44	22
44	26
44	24
44	30
44	31
45	9
45	13
45	15
45	18
45	20
45	23
45	24
45	27
45	29
45	31
46	296
46	301
46	303
46	306
46	308
46	309
46	311
46	312
46	316
46	317
47	320
47	323
47	327
47	329
47	332
47	334
47	336
47	338
47	339
47	341
48	344
48	348
48	351
48	353
48	355
48	358
48	361
48	363
48	366
49	367
49	372
49	377
49	380
49	385
49	387
49	389
49	393
49	397
49	401
50	403
50	407
50	410
50	413
50	415
50	418
50	421
50	423
50	426
51	404
51	407
51	411
51	414
51	416
51	418
51	421
51	424
51	426
52	427
52	432
52	434
52	437
52	440
52	442
52	446
52	448
52	451
53	555
53	558
53	561
53	564
53	565
53	568
53	571
53	573
53	576
53	579
54	582
54	590
54	592
54	597
54	601
54	603
54	608
55	581
55	591
55	595
55	596
55	600
55	605
55	609
56	611
56	613
56	615
56	617
56	619
56	621
56	622
56	624
56	628
56	629
56	632
57	4
57	8
57	1
57	6
57	82
57	84
57	86
57	89
57	90
57	93
57	95
58	4
58	7
58	1
58	6
58	82
58	84
58	87
58	89
58	90
58	92
58	94
59	4
59	7
59	3
59	6
59	82
59	84
59	86
59	89
59	90
59	92
59	94
60	96
60	99
60	101
60	103
60	104
60	106
60	109
60	110
60	112
60	114
61	96
61	99
61	101
61	103
61	104
61	106
61	108
61	110
61	113
61	114
62	97
62	115
62	99
62	101
62	103
62	104
62	106
62	109
62	110
62	113
63	116
63	118
63	121
63	123
63	125
63	126
63	128
63	130
64	453
64	454
64	457
64	460
64	462
64	464
64	467
64	470
64	472
65	475
65	478
65	473
65	483
65	487
65	489
65	490
65	492
65	495
65	498
66	502
66	505
66	508
66	511
66	513
66	516
66	518
66	520
66	522
66	525
66	527
67	530
67	531
67	535
67	536
67	539
67	541
67	545
67	546
67	549
67	552
\.


--
-- Data for Name: product_imgs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_imgs (id, product_id, img_url, is_main) FROM stdin;
81	24	/images/14064382-5159-4444-9f7c-db82fcdc36ad.webp	t
82	24	/images/155c6ca3-625a-45b6-b1a2-4e24a8dab9d7.webp	f
83	24	/images/dff030b9-a57d-4836-ad79-96159bde746d.webp	f
84	24	/images/371b588b-3d6f-4503-9e8b-47bcd5e185c7.webp	f
85	24	/images/78cc1bab-8561-4005-bba3-ee583b87c6eb.webp	f
86	25	/images/01f33aaf-f342-41b4-b957-4c47f6945274.webp	t
87	25	/images/a9a06ed2-d4a7-418c-aa1b-420b244169ea.webp	f
88	25	/images/ce0a56a4-03e5-4454-a699-495de9d58ea6.webp	f
89	25	/images/ebe3ad6d-5b85-4776-9985-04a0f09ce2eb.webp	f
90	25	/images/b1c012cf-848e-4426-9883-ab4442d7e2f6.webp	f
91	26	/images/fd411c87-4f80-4ebb-a19f-2229fda73ece.webp	t
92	26	/images/c26da57f-e3c4-4bb1-a6da-bb3cefbc3e80.webp	f
93	26	/images/56547b7e-14b4-4487-b58c-639fa1eba58a.webp	f
94	26	/images/954eb47b-b017-44d4-9cc7-90aed5722be6.webp	f
95	27	/images/7d567b01-ebad-491e-8f55-a2e558a4b17b.webp	t
96	27	/images/28e014f7-cbd9-4139-81d8-515e89a1a717.webp	f
97	27	/images/19e28c17-6927-4582-b6ae-98c9a41a538b.webp	f
98	27	/images/1bb481bc-fb99-4f68-80f0-728f8fa53fe1.webp	f
99	27	/images/265171cd-8f5b-42ab-9914-2427fcbc0ebf.webp	f
100	27	/images/27c15c6e-146d-4808-923b-98d8bc559a3a.webp	f
101	28	/images/a66508ca-1850-455b-9de1-1daf4157c429.webp	t
102	28	/images/48ef3f9b-9d50-4df8-98b2-10668cd8e96d.webp	f
103	28	/images/c1366d44-cb5b-48e1-92b3-807bee08e47a.webp	f
104	28	/images/e7c5b024-e9c4-4b48-a5d1-68453774f7ed.webp	f
105	29	/images/3b6bc4ba-03b8-45c0-a16d-5dbdcbb89b61.webp	t
106	30	/images/ddbd9397-dd4b-47f0-be58-9722bc0efc50.webp	t
107	30	/images/b7be8052-9cc5-421e-8652-1b2c0e5c189d.webp	f
108	30	/images/2170804e-5150-4b25-af33-aaea7c57b85f.webp	f
109	30	/images/423c305c-bdd3-463c-97d8-cbbb8bbb4543.webp	f
110	30	/images/9ead7fba-ced2-411d-8ae6-0da9c780cb9c.webp	f
111	31	/images/9b3615b9-993b-4c14-af45-6742ce0cfdef.webp	t
112	31	/images/f4434ef3-36dc-4206-b9b7-d8d759b42be9.webp	f
113	31	/images/13415ee8-f5e2-4762-af0e-3b0f9627cec5.webp	f
114	31	/images/b66443fa-4b5b-49bc-a523-43599b5058e4.webp	f
115	31	/images/1446b667-07a8-4304-ad67-a8198e168893.webp	f
116	31	/images/c1d081ef-d42c-4e94-980a-b50ca853634e.webp	f
117	31	/images/72dc1f85-5103-47f0-b009-11f3b29357db.webp	f
118	32	/images/2addfe7c-db38-4a89-8cef-297bd307dc14.webp	t
119	32	/images/4abbcb6c-4fb6-4453-b1f2-c38fa9634203.webp	f
120	32	/images/9e4dde25-05fb-4ea2-8049-e982572f183a.webp	f
121	32	/images/dbbb8d61-a111-479d-9afa-93d1aa14fefa.webp	f
122	33	/images/9744eb80-a4d2-40ca-b21b-481c5a86ecef.webp	t
123	33	/images/7b3eaf62-a236-423b-9658-798144f4a46a.webp	f
124	33	/images/f27bebaf-d794-47e9-8a66-5ee04d0c9ea6.webp	f
125	33	/images/97689df0-462a-4daf-bbb1-ee18b9d39211.webp	f
126	33	/images/6ce8946e-56d5-4772-a3a1-6b9faa857048.webp	f
127	33	/images/52bd8d0e-48e3-43e4-aba0-48fa66e52d8b.webp	f
128	34	/images/6868cf90-a792-413a-89d0-ff00293a150d.webp	t
129	34	/images/ac0adc99-69e2-432d-9bc8-3eaf4a09c07b.webp	f
130	34	/images/9b10925c-c5d8-4753-8951-a053ff9be7eb.webp	f
131	34	/images/d862e980-b5e4-4687-b378-aa781b5ef60f.webp	f
132	34	/images/a131d8f9-4cf4-456f-a25d-2ea099aaca88.webp	f
133	35	/images/5c7d1d21-c8a9-4f2f-a321-4ca1d4e2582f.webp	t
134	35	/images/501a23fd-272c-46d5-8a56-da6da2c6580f.webp	f
135	36	/images/4f265748-b127-4d41-b6bb-864ed7cb7681.webp	t
136	36	/images/dc74f3cc-74ed-4bbc-9c5f-4251a653d960.webp	f
137	36	/images/903d2fde-4197-4ddd-96cd-02edbc90c117.webp	f
138	36	/images/cc78ceac-18f6-4558-a0e8-a50cbefc76ee.webp	f
139	37	/images/9a4d0216-8dae-4b91-8a5f-6e0d3b2622ef.webp	t
140	37	/images/532072e4-5ff8-4613-9b9e-0eebc9128609.webp	f
141	37	/images/fb737c73-d9d9-45be-8078-7d0d2ace7141.webp	f
142	38	/images/2dcad526-15fc-4bd8-aadb-8818d30f35ae.webp	t
143	38	/images/1808bd05-2899-40d5-b1c7-5b02c7da52d4.webp	f
144	38	/images/ae834d6e-8f5c-47f9-9338-53e0331df5dd.webp	f
145	38	/images/60e4e2df-eba3-432c-865c-69a2b5331a53.webp	f
146	39	/images/0b35fb4e-43d1-4c96-83c9-62d14774189e.webp	t
147	39	/images/e79d0291-b1f3-4290-a6f5-2ccc8ba58382.webp	f
148	39	/images/71328ec6-4b57-4248-9361-e4518ecd2900.webp	f
149	39	/images/5539da59-3cc8-42b5-853b-d7649b56fca0.webp	f
150	39	/images/e18e1bb8-2bd4-441d-8569-f86f4be1c84f.webp	f
151	40	/images/6e705202-0108-42d4-a8f6-e8c50c7e9247.webp	t
152	40	/images/808571cd-68eb-4796-a6f7-1897c3b429c9.webp	f
153	40	/images/3ef160ec-6847-47cc-8427-ef7a828121bd.webp	f
154	40	/images/c85116ad-6dcd-4974-b3d3-198766f8c737.webp	f
155	40	/images/61229811-a829-4bfa-ade8-942dbe1e6281.webp	f
156	41	/images/48aff770-ace1-4525-9cca-81341ba61e71.webp	t
157	41	/images/69f9f812-922e-45ac-9501-2667ae7737e6.webp	f
158	41	/images/dca761a2-d184-45a5-bf99-666e43bc2fcc.webp	f
159	41	/images/d3ebec15-38eb-472d-8de1-6e861afc9ac4.webp	f
160	41	/images/8a4b28f0-896a-48b7-b73f-b1335f9abb28.webp	f
161	42	/images/54252f2e-e032-4dd8-8ac7-39af7d29f420.webp	t
162	42	/images/3544e9ac-0856-4bbc-a859-14c223b04bdb.webp	f
163	42	/images/6209b003-eebe-4d29-b234-8615c9d71586.webp	f
164	42	/images/006a117f-73ed-4683-b959-28c9d0b6054d.webp	f
77	23	/images/ca0cd68e-25b4-4aa3-9713-b597670045b7.webp	t
78	23	/images/c9dd55db-90bf-4b0a-b697-4d83309d88e4.webp	f
79	23	/images/e7ecc8c9-6c0a-45cf-ace6-4346a27740d7.webp	f
80	23	/images/f386ae52-1e5e-4e80-9abb-5616083a1e6b.webp	f
165	42	/images/d09d2165-96ae-4d24-889e-f6c91d4d824a.webp	f
166	43	/images/f8c5defc-eb80-441e-83d7-3b2253088bcb.webp	t
167	43	/images/546bd131-e432-454c-bb8f-b0d0b3d17237.webp	f
168	43	/images/22918acd-3f1f-41a8-9292-6558dff59059.webp	f
169	43	/images/d3c108e9-047b-42fb-9a53-83417ee50d4e.webp	f
170	43	/images/00173af4-db07-4ee1-a941-bffea8f45096.webp	f
171	43	/images/7a0ff389-f984-47b5-810f-0544a4ddccd6.webp	f
172	44	/images/71f3e243-513f-4c7f-8bd6-32394888dc88.webp	t
173	44	/images/8a2e7482-f378-41e9-8574-e2ad0cfa78a5.webp	f
174	44	/images/23e89bba-4818-491b-a9d1-98e61069d959.webp	f
175	44	/images/88883918-6922-4ed2-8fbd-d03755aa8a29.webp	f
176	44	/images/0774ef36-351b-47d2-be84-11444c4a4773.webp	f
177	45	/images/3bf89285-40fe-4c5e-9c2d-56f4be9b6a30.webp	t
178	45	/images/433e51d8-0318-46f0-9715-36baf10ca56c.webp	f
179	45	/images/59ceffbc-94c1-426d-9817-4fcc07182e69.webp	f
180	45	/images/3237c0bd-b026-4ba2-9ee2-51b00081d0b7.webp	f
181	46	/images/5c00310e-d4ea-41a6-b95e-06c60b0608ac.webp	t
182	46	/images/3fa63f6c-aa59-4cc0-aaef-420d6af0b96b.webp	f
183	46	/images/6db589e8-3a91-48cc-9bd3-095f2ee1a73c.webp	f
184	46	/images/329a2cf6-0a7c-474a-b67a-3b16841e10f3.webp	f
185	46	/images/340c9628-73f4-4fe3-ba0b-bb4eb610ffdf.webp	f
186	47	/images/b4de3d59-7a54-4d12-a76f-3b22bbaf476c.webp	t
187	47	/images/6e7c4e0d-8a5e-4160-90c4-a713669ddbd1.webp	f
188	47	/images/ab8d0537-6be1-4494-a0bb-76b54684cd4c.webp	f
189	47	/images/f8584e00-48e6-4a57-b1f3-e24256183ad6.webp	f
190	48	/images/cf6012b1-1527-42be-b887-63716648136e.webp	t
191	48	/images/f2054c7e-54ed-453b-be3f-b0736da48e5f.webp	f
192	48	/images/a54a4141-67b5-4b55-b4d3-5810e87683ab.webp	f
193	48	/images/a2a5aa90-0cb5-45d9-ad4c-44fc7f5474e6.webp	f
194	48	/images/cf1fe8cb-503e-4c0f-86a8-c5e75ad57351.webp	f
195	49	/images/9b95d42a-8ccb-42c8-b2d5-ac2533ec080b.webp	t
196	49	/images/3b672d6e-6fd7-4246-bae9-e73a1ea935eb.webp	f
197	49	/images/263f54f8-7c28-408d-b357-3a5641231471.webp	f
198	49	/images/35b8260f-5c9c-4e89-be30-cba882e01987.webp	f
199	50	/images/c321af82-e969-4be1-98aa-dda47fb98aa3.webp	t
200	50	/images/41673d87-a0a9-4746-9ce3-ff5a619043e5.webp	f
201	50	/images/93f10622-0ed1-48b6-a6e2-17b4a9a80fe2.webp	f
202	50	/images/622ae7c7-6082-4646-a077-9c6bcbbc6dbc.webp	f
203	51	/images/90f6e4e6-b917-4214-a360-eb85414c3d2e.webp	t
204	51	/images/98ce9e0c-9476-48fe-8a24-8229b98afcce.webp	f
205	51	/images/e3e3e46e-18ac-4f32-a96c-96e8c8b52808.webp	f
206	51	/images/acba7290-e2b4-42d5-a06d-4254d80339fb.webp	f
207	52	/images/f258140d-11b6-427e-97b1-c7e395dc0088.webp	t
208	52	/images/6705f273-fa56-4919-82f1-a41f9eb94b1f.webp	f
209	52	/images/164f1836-2ffc-47be-88ae-65773a8ba522.webp	f
210	53	/images/6829bcc6-2f83-4a9f-9e4f-36fa16fb9107.webp	t
211	53	/images/950adee8-9f37-42b3-9af9-3668653c48e2.webp	f
212	53	/images/6fd61b1b-2610-48b1-9957-c51f9031cdac.webp	f
213	53	/images/54b446ad-1abb-48d9-bfe3-10a4613195b7.webp	f
214	53	/images/1f6bd5fe-89fb-4abc-bcf6-a4d3e7351382.webp	f
215	54	/images/2671953c-20ac-423e-8d60-2b680fcce7cb.webp	t
216	54	/images/aff7ade1-21e6-47ea-8250-b513b1912777.webp	f
217	54	/images/a039630f-a44e-4e90-96ec-5e488d73e309.webp	f
218	54	/images/2d46c6f8-6210-4604-907d-bda44975f2ae.webp	f
219	54	/images/8359f827-fabc-4a61-a2cc-5506af21bf85.webp	f
220	54	/images/53e661e8-ec35-44c7-9766-417cebb70333.webp	f
221	55	/images/a6bd625d-ea2e-4c7f-9be5-050b3c1eb4e8.webp	t
222	55	/images/2f300619-2590-42e1-b2d0-b7a065add070.webp	f
223	55	/images/d78895b6-5a9c-4e01-8c83-8d411bd9ee1f.webp	f
224	55	/images/a30357c3-94a6-44a2-8a62-79928cccdbcb.webp	f
225	55	/images/aab2d717-163d-44aa-8c83-6fb6326b09a9.webp	f
226	55	/images/f183f6a7-cf69-43e4-bc7b-fdd355e3e182.webp	f
227	55	/images/7d1754a2-f8aa-4f0a-992e-acd8028edcd6.webp	f
228	56	/images/0af40b3a-651d-4bc6-b84a-1b99eb24a21e.webp	t
229	56	/images/4ce27596-41f8-4215-9bfc-fce593c437d6.webp	f
230	56	/images/b270d8df-5081-402f-8bef-785668d6c06b.webp	f
231	56	/images/f19df62f-3989-496e-8640-c29931cfb84d.webp	f
232	56	/images/36a234d0-68ee-4e19-9f62-b933f881cdeb.webp	f
233	57	/images/be2c892a-d8de-43d1-8996-2d8a798e28e0.webp	t
234	57	/images/01ceba5a-3ee3-493d-819f-9c966da769a7.webp	f
235	57	/images/4f4729a9-058e-49c7-8342-64db87b6c6b3.webp	f
236	57	/images/a33c69be-e2c8-488f-801d-0d29c550406a.webp	f
237	58	/images/2e0ce0bf-e90e-4ac5-8bea-bc27a003b954.webp	t
238	58	/images/c95f4624-825a-4484-b531-e49cb28ad732.webp	f
239	58	/images/c0f0826b-d2ae-411a-8524-ce3a2019e066.webp	f
240	58	/images/9ad71f26-2558-45ba-822d-c49745238cee.webp	f
241	58	/images/cbcc9daf-14b9-420b-bcae-eb73b8ae8cd4.webp	f
242	58	/images/c5841726-4c3f-4efd-91c9-8932a5152466.webp	f
243	59	/images/0d52c1a1-e64d-4d52-8df9-331d80bef266.webp	t
244	59	/images/9604f82d-04a0-464d-ac07-a16b9858308e.webp	f
245	59	/images/7105d201-ca71-4f42-b25b-0d1b8639af07.webp	f
246	59	/images/02e25477-5f22-47e2-8d60-2fd1eda1cf4c.webp	f
247	59	/images/ba398561-86c1-4adc-85b7-5a23ca648573.webp	f
248	59	/images/1b53d518-977b-4fcd-8f59-4d16ce00f907.webp	f
249	59	/images/01ce93ac-fef2-43a6-8b0e-a39b3d4a110c.webp	f
250	60	/images/28c9d819-738e-4138-95d3-a6829cd39cac.webp	t
251	60	/images/b417da68-0e26-465b-bfe0-66004208452e.webp	f
252	60	/images/de4b33cc-5c4a-496f-9568-a398fe9b620c.webp	f
253	60	/images/1225f8b2-2653-4129-834a-40657e007d2f.webp	f
254	60	/images/75e5d0ff-9abb-4760-9e33-7b6e2c212adb.webp	f
255	61	/images/395ef86b-3de8-40ac-a1ec-89b8dbb44b02.webp	t
256	61	/images/1d18c87b-475b-4efa-8789-b0cf9b50b9d6.webp	f
257	61	/images/d20cc963-7ad4-493a-9dd1-66ae337fa47c.webp	f
258	61	/images/72df2ea7-91e5-452a-ad94-e3a960e44dc2.webp	f
259	61	/images/a93e0f06-0a25-4b3b-aee8-37981d5454d3.webp	f
260	62	/images/1b73d5d6-e946-47ee-8ff5-894e7b52ddf9.webp	t
261	62	/images/dd27570f-c464-45dd-85fb-4f0367c61cb2.webp	f
262	62	/images/a94a3c39-b22e-422e-acd4-7d9bfe48618d.webp	f
263	62	/images/09bc56c8-5ba9-41ed-924e-2ddb28e26fcc.webp	f
264	62	/images/dd002f49-b62b-4274-a7d3-17ee76b373b0.webp	f
265	63	/images/1a475faa-998b-4600-82d6-8fd164e66cda.webp	t
266	63	/images/dc85e699-0827-412e-b435-06c03f16e6a9.webp	f
267	63	/images/acb22b6a-4bee-44de-bb5d-09ed00574b18.webp	f
268	63	/images/e78344e1-15b0-4825-9ecc-bfde36505191.webp	f
269	63	/images/7822af85-cee5-4a37-abb1-d6a144375b95.webp	f
270	64	/images/e1d56a28-e3a2-40f3-bf6d-6e4f63826fbe.webp	t
271	64	/images/99d12f86-3cad-43dd-953f-643ef162853f.webp	f
272	64	/images/ad5d8580-0586-47e8-aefb-97d71be6e960.webp	f
273	64	/images/6c736501-09e6-4a7b-ade5-5dc658a76864.webp	f
274	65	/images/d925c4a1-83a8-487c-a244-683230a4c45b.webp	t
275	65	/images/c5641605-307e-4614-8373-e31e40634dfd.webp	f
276	65	/images/5d274162-b39d-4386-9b47-8ed10f729aab.webp	f
277	65	/images/a6e21271-6633-4c51-8342-83e81f1703e3.webp	f
278	66	/images/97be4db7-2561-41af-8b49-de7d76af4205.webp	t
279	66	/images/744114c2-3e19-4c22-bf0a-b480851af477.webp	f
280	66	/images/42f6a190-2551-4db9-b629-c50744aa560d.webp	f
281	67	/images/f590b1d0-fc06-4f72-88f6-b72f70b2183c.webp	t
282	67	/images/d1e8dec8-00bb-4911-a87a-dfc3e7958c4d.webp	f
283	67	/images/2838dd5d-669f-4b33-baf5-9d28779e84c6.webp	f
284	67	/images/5ff108bb-dcb5-4bf8-80d9-27f2f1e14837.webp	f
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, brand_name_id, price, date_registered, category_name_id, description, producer_id) FROM stdin;
23	Холодильник Kraft KR-55W	19	11000	2025-04-21 19:51:54	7	Компактный холодильник Kraft KR-55W обладает размерами 51,5х44х47 см, весит 15 кг. Объем холодильной камеры - 46 л, морозильной - 4 л. Морозильная камера расположена внутри сверху. Холодильная камера представлена двумя полками и двумя дверными карманами.\r\nМодель выполнена в белом цвете и снабжена механическим блоком управлением. Металлическая дверь покрыта эмалью, открывается на правую сторону.\r\nОдин стандартный компрессор работает с максимальным уровнем шума 41 дБ. Хладагент R 600a безопасен для человека и окружающей среды.	9
24	Холодильник Бирюса	19	25000	2025-04-21 19:57:39	7	Холодильник двухкамерный Бирюса 553 – идеальный выбор для тех, кто ищет надежное решение для хранения продуктов. С его объемом в 230 литров и высотой 1,45 метра, этот холодильник отлично впишется в любую кухню, обеспечивая вам достаточно места для свежих продуктов и замороженных товаров.\r\nМодель оснащена морозильной камерой сверху, что делает доступ к замороженным продуктам более удобным и практичным. Автооттаивание избавляет вас от лишних забот, позволяя сосредоточиться на более важных делах, а не на размораживании устройства.	10
25	Холодильник Hi HTDN01	19	19000	2025-04-21 20:01:06	7	олодильник Hi HTDN011950RW — компактная двухкамерная модель с верхней морозильной камерой, идеально подходящая для небольших кухонь или дач. Общий полезный объем составляет 131 литр, из которых 91 литр отведено под холодильное отделение и 40 литров — под морозильную камеру. Морозильная камера оснащена ручной системой размораживания и обеспечивает мощность замораживания до 2 кг в сутки.​\r\n\r\nУровень шума составляет 43 дБ, что делает работу устройства практически бесшумной. Энергопотребление модели соответствует классу A+, что способствует экономии электроэнергии.	9
26	Сплит-система RAM	19	14000	2025-04-21 20:25:46	8	Сплит-система Rapid RAM-07HJ/N1_23Y в корпусе бело-серой расцветки работает на обогрев, охлаждение и осушение воздуха. Модель заправлена хладагентом R410A. Сплит-система монтируется на стену и рекомендована для установки в помещениях площадью до 21 м².\r\nПрибор оснащен таймером, функциями автоматического рестарта, самоочистки и самодиагностики неисправностей. Для управления сплит-системой предусмотрен пульт. Температуру и сила воздушного потока можно регулировать.	9
27	Сплит-система Carrera	19	35000	2025-04-21 20:29:08	8	Сплит-система Carrera CRCA120 с защитным покрытием Blue Fin и производительностью 12000 BTU подходит для быстрого охлаждения, обогрева, осушения и вентиляции комнаты площадью до 30 м². Сплит-система может использоваться в качестве альтернативы центральному отоплению в прохладные весенние и осенние дни: она эффективно обогревает помещение даже при -7°С.\r\nСплит-систему не понадобится постоянно настраивать вручную: благодаря функции автоконтроля температуры модель самостоятельно адаптируется под погоду на улице или микроклимат в помещении.	9
28	Сплит-система Funai	19	23000	2025-04-21 20:30:46	8	Сплит-система Funai RAC-SM20HP. D04/U Samurai II бело-серебристой расцветки работает с потребляемой мощностью 701 Вт. Прибор относится к классу энергоэффективности A++. Устройство выполнено с нанесением антибактериального покрытия. Управление дистанционное, пульт в комплекте. Корпус оснащен LED-дисплеем, который показывает включение, режим работы, заданную температуру. Режимы работы: Быстрое охлаждение, Быстрый нагрев, Автостарт, Ночной режим и другие. Подача воздуха происходит в четырех направлениях с производительностью холода 2,25 кВт и тепла 2,4 кВт.	10
29	Кухонная плита ПГЭ 5102	19	24000	2025-04-21 20:33:52	27	Комбинированная плита Gefest ПГЭ 5102-01 0194, черная, - модель с габаритными размерами 85х50х58,5 см, весом - 35 кг, которая относится к А-классу энергоэффективности. Присоединительная мощность составляет 2,05 кВт. Доступна работа от газового баллона. В нижней части корпуса предусмотрен ящик для посуды. Устройство обладает четырьмя газовыми конфорками диаметрами 4,9 см, 6,7 см (х2), 8,7 см и мощностью 1 кВт, 1,8 кВт (х2), 2,8 кВт.	11
37	Коврик для мыши RSQ	20	500	2025-04-21 20:59:46	12	Компьютерный коврик для мыши RSQ Gaming XL - игровой коврик для мышки, обладающий гладкой и износостойкой поверхностью, мышь скользит быстро и четко.\r\nКрая качественно прошиты оверлоком.\r\nОбратная сторона выполнена из нескользящей резины.\r\nЧерный классический дизайн подойдёт к любому игровому и рабочему столу. Создан как для ПК, так и для ноутбука.	18
30	Стиральная машина WM61	19	25000	2025-04-21 20:36:35	28	Узкая стиральная машина Hi WM610W, белая вмещает до 6 кг белья и отжимает его со скоростью 400 об/мин, 800 об/мин или 1000 об/мин. Доступен широкий выбор программ для натуральных (хлопок, шерсть), синтетических и смешанных тканей, постельного белья, верхней, детской, спортивной одежды.\r\nДля слабозагрязненных вещей предусмотрены два ускоренных режима, которые длятся 15 минут и 42 минуты. Цикл Очистка барабана поможет поддерживать внутренние элементы устройства в чистоте и избежать появления плесени и неприятного запаха.	11
31	Стиральная машина WSPE7	19	28000	2025-04-21 20:39:04	28	Beko WSPE7612A – узкая стиральная машина, которую вы без проблем разместите в ванной комнате или на кухне. Модель с предельной загрузкой 7 кг оптимально подходит для стандартной семьи из супругов и двух детей.\r\nиндивидуальный подход\r\nПрибор предлагает множество различных режимов, в том числе для шерстяных изделий, хлопка, тёмных тканей, джинсов, рубашек и пуховиков. Если у вас накопились слабозагрязнённые вещи, то для них можно включить экспресс-программу длительностью всего 14 минут.	12
32	Обогреватель КТ-2703	19	5000	2025-04-21 20:41:48	29	Конвекторный обогреватель КТ-2703 предназначен для обогрева воздуха в квартирах, загородных домах, офисах площадью до 20 кв. м. Корпус прибора не нагревается слишком сильно в процессе работы, что особенно важно для семей с маленькими детьми. Обогреватель предназначен как для напольного, так и настенного размещения. Ножки съёмные, в комплекте идёт крепление на стену. Оснащён системой защиты от перегрева для безопасной работы. Прибор имеет 3 уровня мощности и механический термостат для регулировки уровня нагрева.	9
33	Пылесос CT-2565	19	5000	2025-04-21 20:44:42	30	Вертикальный пылесос CENTEK CT-2565 - это удобное и практичное решение для уборки вашего дома. Благодаря своей компактности и эргономичности, он станет незаменимым помощником в поддержании чистоты и порядка.\r\nCENTEK CT-2565 оснащен противоскользящей ручкой, которая обеспечивает удобное и надежное удержание пылесоса в руке. Это позволяет контролировать процесс уборки, не утомляясь и не рискуя выронить пылесос из рук.\r\nМощность всасывания составляет 200 Вт, что обеспечивает эффективное удаление пыли и грязи с различных поверхностей.	10
34	Микроволновка HMT-620	19	20000	2025-04-21 20:48:16	9	Встраиваемая микроволновая печь Weissgauff с объемом 20 литров, выполненная в черном закаленном стекле, равномерно разогревает еду при помощи поворотного стола, а также оснащена грилем с возможностью работы в комбинированном режиме и набором программ автоменю!\r\nОбъем 20 литров дает вам полную уверенность в том, что вы сможете разместить в ней сразу весь необходимый объем пищи!\r\nПоворотный стол диаметром 245 мм не только обеспечивает равномерный прогрев блюда со всех сторон, но и удобно извлекается из камеры, делая легкой его очистку.	9
35	Термопаста ARCTIC	20	500	2025-04-21 20:54:21	11	Термопаста ARCTIC MX-4 – идеальное решение для любых задач.\r\nОна предлагает оптимальную консистенцию, не высыхает и не протекает, обеспечивая стабильную долгосрочную производительность. Высокая теплопроводность достигается за счет заполнения микроскопических неровностей на поверхности процессоров и кулеров, что способствует быстрому и эффективному отведению тепла от чипа. Легкость нанесения делает MX-4 удобной даже для новичков, а её состав, не содержащий металлов и не проводящий электрический ток, гарантирует безопасность использования.	8
36	Термопаста PSG-04	20	300	2025-04-21 20:56:45	11	Термопаста PSYXI PSG-04 (2 г + шпатель)\r\nПрофессиональное решение для эффективного отвода тепла от процессоров и видеокарт с рекордной теплопроводностью!\r\nОсобенности:\r\n✔ Теплопроводность 12.8 Вт/м·К — превосходит многие аналоги, обеспечивая быстрый отвод тепла даже под экстремальными нагрузками.\r\nМинимальное тепловое сопротивление (0.058 °C·см²/Вт) — снижает перегрев компонентов, продлевая их срок службы.\r\nБезопасность — не проводит электрический ток и не создает паразитных емкостных эффектов.\r\nУдобное нанесение — в комплекте шпатель для равномерного распределения.	16
38	Баллон с СВ Turbo	20	400	2025-04-21 21:03:24	10	Баллон со сжатым воздухом Filum Turbo XXL Pro FL-CLN-Air1001 - это пневматический очиститель, который предназначен для удаления загрязнений из труднодоступных мест и с деликатных поверхностей. Объем данного очистителя составляет 1000 миллилитров, что делает его идеальным выбором для использования дома или в офисе, в удобной упаковке баллон с сжатым воздухом.\r\nОн имеет широкий спектр применения, включая очистку клавиатуры, ноутбука, оргтехники и смартфонов.	19
39	Кулер SE-224	17	3000	2025-04-22 16:42:17	2	Кулер для процессоров AM4 с креплением прижимной скобой или с помощью подпружиненных винтов - не безопасен. При транспортировке готовых компьютеров они могут стать причиной повреждения материнской платы компьютера. Такие кулера не рекомендуется использовать с процессорами AMD, несмотря на указание совместимости на упаковке.	4
40	Блок питания PF750	17	5499	2025-04-22 16:45:51	3	Блоки питания DeepCool серии PF обеспечивают безопасное стабильное электропитание с подтверждённой эффективностью стандарта 80 PLUS.\r\nБлоки питания сертифицированы по стандарту 80 PLUS 230V EU, удостоверяющему эффективность 85% под типичной 50-процентной нагрузкой. Чем выше эффективность, тем меньше потери энергии, меньше рабочие температуры и лучше экономия средств.\r\n120-миллиметровый вентилятор оптимизирован для производительной работы с низким уровнем шума и оснащён жидкостным подшипником, снижающим трение и вибрацию и увеличивающим общий срок службы.	7
41	Блок питания CB700	17	2350	2025-04-22 16:47:55	3	Блок питания Ginzzu 700W (CB700) ATX,12CM белый ,20+4p, CPU(4+4), 2 PCI-E(6+2), 6*SATA, 3*IDE, оплетка MB, кабель питания, RET\r\nБлок питания СB700 представляет серию Ginzzu Classic версия ATX 2.3.\r\nМодели БП этой серии предназначены для комплектации домашних вычислительных машин начального уровня.\r\nОни имеет необходимый набор коннекторов и увеличенную длину кабелей питания для обеспечения комфортного подключения всех основных элементов ПК в современных домашних компьютерных системах.\r\nВсе кабеля белого цвета плоские.	3
42	Блок питания PS-850	17	8995	2025-04-22 16:50:25	3	Блок питания 850 Вт, ATX 12V с активным PFC Коннекторы питания материнской платы: 24+8+8 pin Коннекторы питания видеокарт: 4x 6 / 8-pin разъема Отсоединяющиеся кабели питания 80 PLUS Gold DC-DC регулятор напряжения, LLC -резонансный ШИМ-контроллер, Плоские кабели, Японские конденсаторы.	5
43	Видеокарта RTX4060	17	39990	2025-04-22 16:56:32	1	Видеокарта Gigabyte GeForce RTX 4060 WINDFORCE OC 8GB — это мощное решение для геймеров и создателей контента. Основана на архитектуре NVIDIA Ada Lovelace, обеспечивает отличную производительность и энергоэффективность. Оснащена 8 ГБ памяти GDDR6, поддерживает трассировку лучей и DLSS 3. Система охлаждения WINDFORCE с двумя вентиляторами эффективно снижает температуру. Поддержка 4K-гейминга и высокая частота кадров делают её отличным выбором для современных игр.	6
44	Видеокарта RTX 3060	17	29990	2025-04-22 17:00:41	1	Видеокарта Gigabyte GeForce RTX 3060 Gaming OC Rev2.0 гарантирует возможность комфортного использования большинства видеоигр. Главный компонент видеоадаптера – видеопроцессор NVIDIA GeForce RTX 3060. Устройство не располагает поддержкой мультипроцессорной конфигурации.Система охлаждения WINDFORCE 3X представлена фирменным радиатором и 3 композитными медными тепловыми трубками прямого контакта с графическим процессором, тремя 80-мм вентиляторами с уникальным профилем лопастей крыльчатки, а также фирменными функциями 3D Active Fan и Screen Cooling.	6
45	Видеокарта RX 6500XT	17	22995	2025-04-22 17:05:29	1	Товар Видеокарта Sapphire PCI-E 4.0 11314-04-20G RX 6500XT ITX PURE GAMING OC AMD Radeon RX 6500XT 4Gb 64bit GDDR6 2685/18000 HDMIx1 DPx1 HDCP Ret имеет широкий спектр преимуществ и характеристик\r\nУникальные возможности: Поддержка HDCP, Для геймеров, Необходимость дополнительного питания, Использование тепловых трубок OverClock Edition.	8
46	Материнская плата B550	17	12890	2025-04-22 17:08:43	13	Материнская плата MSI MPG B550 GAMING PLUS – отличный выбор для любителей игр, предпочитающих использовать процессоры AMD. Устройство совместимо с процессорами, для установки которых используется сокет AM4. Плата, располагающая возможностью монтажа до 128 ГБ памяти, подходит не только для развлечений, но и для профессиональных задач. В этой связи вам наверняка будет полезна поддержка NVMe, благодаря которой можно задействовать скоростные SSD.	4
47	Оперативная память 16GB	17	3450	2025-04-22 17:12:40	14	Оперативная память 16Gb DDR4 3600MHz Corsair XPG Gammix D10 (AX4U36008G18I-DB10) - это высококачественный комплект из двух модулей по 8 Гб каждый, обеспечивающий надежную и быструю работу вашего компьютера. Эта память отличается не только отличной производительностью, но и стильным дизайном радиаторов, которые не только эффективно охлаждают модули, но и придают им современный и агрессивный вид.\r\nФорм-фактор DIMM и тип памяти DDR4 делают этот комплект совместимым с большинством современных материнских плат, что делает его отличным выбором для обновления или апгрейда вашего ПК.	3
48	Процессор Intel Core i9	17	45990	2025-04-22 17:16:46	15	Процессор Intel Core i9-14900K BOX — флагманская производительность для энтузиастов\r\nIntel Core i9-14900K — это высокопроизводительный процессор 14-го поколения, разработанный на базе архитектуры Raptor Lake Refresh. Он предназначен для требовательных пользователей, которым необходимы максимальная мощность и скорость в задачах, связанных с играми, профессиональной работой и творчеством.	22
49	Кабель питания IEC-C13	17	599	2025-04-22 17:19:45	16	Кабель питания PALMEXX IEC-C13: надежность и функциональность\r\nКабель PALMEXX IEC-C13 обеспечивает стабильное и безопасное подключение к электросети. С длиной 1,5 метра и угловым разъемом, этот кабель станет незаменимым помощником в организации рабочего места или дома.\r\nКабель изготовлен из высококачественных материалов: проводник из меди, диэлектрик из поливинилхлорида (PVC), оболочка из поливинилхлорида (PVC). Это гарантирует его долговечность и надежность в эксплуатации.	15
50	Жесткий диск BarraCuda	17	5950	2025-04-22 17:23:59	17	Жесткий диск Seagate BarraCuda 3.5" — надёжное и ёмкое решение для хранения данных. Объём до 2 ТБ (в зависимости от модели) позволяет сохранять большие объёмы информации: игры, фильмы, документы и архивы. Скорость вращения 7200 об/мин и интерфейс SATA III обеспечивают высокую скорость чтения и записи. Технология Multi-Tier Caching ускоряет доступ к данным. Подходит для настольных ПК, отличается стабильной работой и долговечностью.	23
51	SSD диск M480	17	15790	2025-04-22 17:29:00	17	Внутренний SSD MSI Spatium M480 Pro 2TB (S78-440Q600-P83) — высокопроизводительное решение для геймеров и профессионалов. Оснащён интерфейсом PCIe 4.0 x4 и контроллером Phison E18, обеспечивает скорость чтения до 7400 МБ/с и записи до 7000 МБ/с. Использует 176-слойную 3D TLC NAND-память от Micron и 2 ГБ DDR4-кэш для стабильной работы. Поддерживает NVMe 1.4, TRIM и 256-битное AES-шифрование. Форм-фактор M.2 2280 делает его совместимым с большинством современных систем. Гарантия — 5 лет или до 1400 ТБW.​	4
52	Светодиодная лента RGB	17	735	2025-04-22 17:32:33	18	Светодиодная лента служит для украшения и придания эстетического вида Вашему системному блоку. Подключение происходит через разъем RGB 12V 4Pin. Подсветка и режимы управляются через приложения Asus Aura, Gigabyte RGB Fusion, MSI Mystic Light, Asrock Polychrome Sync. Лента фиксируется к корпусу с помощью двустороннего скотча.\r\nЕсли у Вас отсутствует разъем на материнской плате RGB 12V 4Pin, подключить данную ленту можно с помощью контроллера, который Вы найдете в карточке товара. В таком случае подсветка и режимы будут управляться через контроллер RGB.	24
53	Колонки Defender Z4	18	1050	2025-04-22 17:43:56	24	Акустическая система 2.1 для ПК или ноутбука займет минимум места на рабочем столе, благодаря компактному размеру и минималистичному дизайну.\r\nДанная модель подойдет для компьютера и ноутбука.\r\nРегуляторы громкости и низких частот расположены на передней панели сабвуфера. Больше не придется переключаться на управление вашим медиаплеером, чтобы настроить звучание и отрегулировать громкость.\r\nИндикатор сети. Фазоинвертор на задней панели. Максимальное расстояние между сателлитами 1,35 метров.	25
55	Телевизор Crystal UHD	18	31890	2025-04-22 17:55:47	25	Этот телевизор обеспечивает чёткое изображение и насыщенные цвета благодаря технологии Crystal UHD и поддержке HDR. Интеграция с экосистемой Samsung SmartThings позволяет управлять устройствами умного дома напрямую с экрана телевизора. Игровые функции, такие как автоматический игровой режим и переменная частота обновления, обеспечивают плавный игровой процесс. Современные интерфейсы подключения и поддержка различных форматов делают этот телевизор универсальным решением для домашнего развлечения.​	9
56	VR-шлем Oculus Quest 3s	18	35890	2025-04-22 18:02:53	26	Oculus Quest 3S. Этот шлем является облегченной версией Quest 3 и предлагает улучшенный пользовательский опыт. В основе устройства лежит мощный чип Qualcomm Snapdragon XR2 Gen2, обеспечивающий высокую производительность и плавность работы VR-приложений. Quest 3S оборудован ЖК-дисплеем с разрешением 2880x1600 пикс, что гарантирует четкость и яркость получаемого изображение, а частота обновления экрана 90 и 120 Гц гарантирует плавность отображения при быстром движении в играх и приложениях.	27
57	Logitech G515	18	14500	2025-04-22 18:09:06	4	Logitech G515 TKL LIGHTSPEED - это беспроводная механическая клавиатура, которая сочетает в себе функциональность, удобство и стиль.\r\nКлавиатура выполнена из прочного пластика, что обеспечивает ей долгий срок службы. Ее размеры составляют 368 мм в длину, 150 мм в ширину и 22 мм в высоту, что делает ее компактной и удобной для использования. Вес клавиатуры без кабеля составляет 880 грамм, а длина кабеля - 1,8 метра.\r\nКлавиатура оснащена низкопрофильным переключателем с точкой начала в 1,3 мм и усилием срабатывания 43 грамма. Общее расстояние перемещения составляет 3,2 мм.	1
58	Клавиатура Redragon Shiva	18	2000	2025-04-22 18:13:29	4	Игровая клавиатура Redragon Shiva RU, с подсветкой RGB, 26 Anti-Ghost: Надежная игровая клавиатура в классическом дизайне с выразительной RGB подсветкой и съемной текстурной подставкой под запястья. Функция Anti-ghost, 6 программируемых макро-клавиш и кнопка записи макросов - продвинутый геймерский функционал, разумная цена, долгий срок службы.	28
54	Монитор Samsung Odyssey	18	15995	2025-04-22 17:50:20	25	Монитор Samsung Odyssey G3 S24AG320NI — 24-дюймовый игровой дисплей с разрешением Full HD (1920×1080) и частотой обновления 165 Гц. Благодаря технологии AMD FreeSync Premium и времени отклика 1 мс, он обеспечивает плавное изображение без разрывов и задержек. VA-матрица с контрастностью 3000:1 и яркостью 250 кд/м² гарантирует насыщенные цвета и глубокий чёрный. Углы обзора 178° обеспечивают чёткое изображение под любым углом. Монитор оснащён интерфейсами HDMI 1.4 и DisplayPort 1.2, а также регулируемой подставкой с возможностью наклона, поворота и изменения высоты.	9
59	Клавиатура GK-100DL	18	1290	2025-04-22 18:19:37	4	Игровая клавиатура Defender Doom Keeper RU с подсветкой, 19 Anti-Ghost:\r\nИгровая проводная клавиатура Defender Doom Keeper GK-100DL RU:\r\nСтильная игровая клавиатура с подсветкой и агрессивный дизайном, обладающая широким набором функций, которые помогут как начинающему геймеру, так и человеку с опытом достижения побед на игровом поле. Восемь сменных кнопок WASD + Стрелки в комплекте.	25
60	Мышь Redragon Griffin	18	1590	2025-04-22 18:24:14	5	Redragon Redragon Griffin это удобная в использовании, чувствительная и надёжная в работе проводная оптическая мышь с помощью которой вы легко сможете управлять работой компьютера.\r\nКупить мышку можно не только для ПК. Девайс подключается как к компьютеру, так и к ноутбуку с помощью интерфейса USB, что обеспечивает стабильность связи и высокую скорость взаимодействия. Питание мыши осуществляется непосредственно от USB. Разрешение используемого в конструкции девайса сенсора составляет 3200 dpi.	28
61	Игровая мышь Basilisk V3	18	4990	2025-04-22 18:26:55	5	Полный спектр настройки.\r\nСоздавайте, контролируйте и отстаивайте свой стиль игры с помощью новой Razer Basilisk V3 — квинтэссенции эргономичной игровой мыши для настраиваемой производительности. Благодаря программируемым кнопкам, интеллектуальному колесу прокрутки и большому количеству зон подсветки Razer Chroma RGB, настало время подсветить ваш путь.	2
62	Компьютерная мышь G703	18	4990	2025-04-22 18:31:22	5	Беспроводная игровая мышь Logitech G703 LIGHTSPEED оснащена новейшим датчиком HERO 25K. Этот датчик позволяет выполнять отслеживание без задержек на скорости более 10 м/с (400 дюйм/с) при уровне чувствительности до 25 600 точек на дюйм, сохраняя нулевые значения сглаживания, ускорения и фильтрации. Датчик HERO 25K отслеживает движение на уровне одной миллионной доли метра — а это поистине филигранная точность. Технология беспроводной связи LIGHTSPEED обеспечивает сверхвысокую частоту опроса (1 мс) и сниженный в 10 раз уровень потребления энергии (по сравнению с предыдущими моделями).	1
63	Наушники Razer Blackshark	18	3290	2025-04-22 18:34:51	6	Razer Blackshark V2 X – игровые наушники, которые подходят для киберспортивных развлечений. Аксессуар можно подключить к компьютеру при помощи 1,3-метрового кабеля с коннектором 3,5 мм.\r\nRazer Blackshark V2 X используют 50-миллиметровые динамики Razer Triforce, сделанные из титана. Они индивидуально воспроизводят басы, высокие и средние чистоты. Закрытые чашки с мягкими амбушюрами из воздухопроницаемого материала обеспечивают высокую степень шумоизоляции.\r\nНаушники оснащены кардиоидным микрофоном с гибкой ножкой и минимальным искажением голоса.	2
64	Геймпад Xbox Series	18	5850	2025-04-22 18:41:18	20	Беспроводной геймпад Xbox Series Wireless Controller Black (Carbon Black) - это модернизированный игровой контроллер, который сочетает в себе комфорт и легкость управления во время игры.\r\nГеймпад оснащен гибридной крестовиной и текстурированными поверхностями триггеров, бамперов и задней части корпуса, что обеспечивает улучшенное управление и точность.\r\nБеспроводной геймпад поддерживает подключение к ПК или консоли напрямую через порт USB-C. В задней части геймпада расположен отсек для батареек типа AA. Подключайте к стереогнезду 3,5 мм любую совместимую гарнитуру.	29
65	Флешка DataTraveler Max	18	4590	2025-04-22 18:47:36	21	USB-накопители данной серии разработаны по новейшему стандарту USB 3.2 Gen 2, который обеспечивает рекордную скорость чтения/записи до 1200 МБ/с. Уникальный ребристый корпус, разработанный с учетом портативности и удобства, защищает разъем, когда он не используется, и легко перемещается одним движением. Данная серия DT Max обеспечивает превосходную производительность и имеет емкость памяти до 256 Гб, благодаря чему является идеальным решением для передачи и хранения цифровых файлов большого размера, таких как фотографии в качестве HD, видео с разрешением 4K/8K.	30
66	Микрофон Fifine K669D	18	5290	2025-04-22 18:50:31	22	Fifine K669D XLR – это динамический микрофон с проводным подключением, который отлично подойдет для записи подкастов, стримов, озвучки, проведения трансляций. Он имеет кардиоидный капсюль, который обеспечивает высокую четкость и детализацию речи.\r\nМикрофон K669D XLR выполнен в эргономичном дизайне и может крепиться на комплектную настольную подставку. Простая, но надежная конструкция обеспечивает высокую четкость звучания, благодаря профессиональному разъему XLR. Микрофон совместим с любыми стойками с резьбой 3/8" и 5/8". Функциональность Fifine K669D XLR позволяет без каких-либо помех	31
67	МФУ Canon Pixma	18	13990	2025-04-22 18:54:14	23	Это многофункциональное устройство формата A4 отлично справляется с любыми домашними задачами. Оно обеспечивает высококачественную печать документов с разрешением до 4800 x 1200 dpi и скоростью до 8,8 стр/мин для черно-белых документов формата A4. Цветная печать изображений также выполняется на высоком уровне с разрешением до 4800 x 1200 dpi.\r\nПри необходимости отсканировать документ или сделать копию, Canon Pixma G3416 выполнит эту работу с высоким качеством (до 600 x 1200 dpi). Подключение устройства возможно через USB, Wi-Fi и функцию прямой печати.	32
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, registration_date, is_seller, profile_img, shipping_address) FROM stdin;
31	Алексей	alexEmail@mail.ru	$2b$10$COVTXfVssk14zSE/Asj4H.uumcqJcCRLhtxZ9yPzW198df7KE/moO	2025-04-21 18:33:49	t	/images/9222668d-72db-485c-b4f9-f8fc3a27d16d.png	г. Москва, ул. Пушкина, 120
32	Борис	borisEmail@mail.ru	$2b$10$igWfeC//sI.h109uksSWLOiz16E4yVRXIehND5fnmAlIezCBSIYRG	2025-04-21 19:06:02	t	/images/fb35add2-8699-43a2-8004-6d65f5c5c631.png	г. Воронеж, ул. Моисеева, 12
33	Вячеслав	vyacheslavEmail@mail.ru	$2b$10$d7Hql3U1FkGzeMcsIxlEDOUerb.xHyRcEas5UdI9rXYAEp3.JhnrO	2025-04-21 19:11:57	t	/images/ce9fde02-3df6-42cb-b474-09e540d5f179.png	г. Москва, ул. Профсоюзная, 78
34	Генадий	genadiyEmail@mail.ru	$2b$10$Mo56HC0/YEpKaeh1prl04e2c3iETkFQw8W4qhLX02NxqyIj3Ep7jS	2025-04-21 19:33:09	t	/images/170d20ab-007d-4c76-9303-853818b562c2.png	г. Воронеж, ул. Тверская, 12
\.


--
-- Name: attribute_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attribute_values_id_seq', 731, true);


--
-- Name: attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_id_seq', 286, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 20, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 30, true);


--
-- Name: master_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.master_categories_id_seq', 4, true);


--
-- Name: prodcut_imgs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prodcut_imgs_id_seq', 284, true);


--
-- Name: producers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producers_id_seq', 32, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 67, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 34, true);


--
-- Name: attribute_values attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_pkey PRIMARY KEY (id);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (id);


--
-- Name: brands brands_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_brand_name_key UNIQUE (brand_name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: master_categories master_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_categories
    ADD CONSTRAINT master_categories_pkey PRIMARY KEY (id);


--
-- Name: product_imgs prodcut_imgs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_imgs
    ADD CONSTRAINT prodcut_imgs_pkey PRIMARY KEY (id);


--
-- Name: producers producers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producers
    ADD CONSTRAINT producers_pkey PRIMARY KEY (id);


--
-- Name: product_attributes product_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (product_id, attribute_value_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: attribute_values attribute_values_attribute_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_attribute_name_id_fkey FOREIGN KEY (attribute_name_id) REFERENCES public.attributes(id) ON DELETE CASCADE;


--
-- Name: attributes attributes_category_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_category_name_id_fkey FOREIGN KEY (category_name_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: brands brands_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_master_category_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_master_category_name_id_fkey FOREIGN KEY (master_category_name_id) REFERENCES public.master_categories(id) ON DELETE CASCADE;


--
-- Name: product_imgs prodcut_imgs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_imgs
    ADD CONSTRAINT prodcut_imgs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_attributes product_attributes_attribute_value_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_attribute_value_id_fkey FOREIGN KEY (attribute_value_id) REFERENCES public.attribute_values(id) ON DELETE CASCADE;


--
-- Name: product_attributes product_attributes_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_brand_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_name_id_fkey FOREIGN KEY (brand_name_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: products products_category_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_name_id_fkey FOREIGN KEY (category_name_id) REFERENCES public.categories(id);


--
-- Name: products products_producer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_producer_id_fkey FOREIGN KEY (producer_id) REFERENCES public.producers(id);


--
-- PostgreSQL database dump complete
--

