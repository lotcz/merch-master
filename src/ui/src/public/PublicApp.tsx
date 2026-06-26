import {Button, Col, Container, Row} from "react-bootstrap";
import {BsCashCoin, BsRocket, BsSliders2} from "react-icons/bs";
import {Link} from "react-router";
import BrandLogoText from "../shared/component/brand/BrandLogoText";
import {ImagezImage} from "../shared/component/images/ImagezImage";
import "./style/public.less";

export default function PublicApp() {
	return (
		<div>
			<header>
				<Container className="py-3">
					<div className="public-header d-flex align-items-center justify-content-between">
						<BrandLogoText size="sm"/>
						<nav className="d-flex gap-3">
							<a href="#jak-to-funguje">Jak to funguje</a>
							<Button className="btn-brand" size="sm">
								Začít navrhovat
							</Button>
							<Link to="/creator">přihlásit</Link>
							<Link to="/admin">admin</Link>
						</nav>
					</div>
				</Container>
			</header>

			<section className="section-1">
				<Container className="py-3">
					<Row>
						<Col md={6}>
							<div className="pt-5">
								<h2>Vytvoř si unikátní merch a začni prodávat na pár kliknutí</h2>
								<p>
									Nakonfiguruj si vlastní produkty a my ti zdarma vytvoříme e-shop, kde je hned můžeš začít prodávat. Ty vytvoříš
									zajímavý design, my ho vyrobíme a dáme ti provizi z každého prodaného kusu.
								</p>
								<Button variant="brand" className="px-5">
									Chci vlastní merch
								</Button>
							</div>
						</Col>
						<Col md={6}>
							<div className="d-flex flex-column align-items-center p-4">
								<ImagezImage name="8644cb3294686b660ccd0c7f2140eeeb.png" type="Fit" width={350} height={350}/>
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			<section className="section-2">
				<Container className="py-4">
					<div className="text-center">
						<h2>3 KROKY K TVÉMU ÚSPĚCHU</h2>
					</div>
					<Row>
						<Col>
							<div className="step-to-success step-1">
								<div className="image">
									<div className="inner">
										<div className="number">1</div>
										<div className="icon">
											<BsSliders2/>
										</div>
									</div>
								</div>
								<div>
									<h3>NAVRHNI & KONFIGURUJ</h3>
									<div className="text">Navrhni na nakonfiguj své produkty</div>
								</div>
							</div>
						</Col>
						<Col>
							<div className="step-to-success step-2">
								<div className="image">
									<div className="inner">
										<div className="number">2</div>
										<div className="icon">
											<BsRocket/>
										</div>
									</div>
								</div>
								<div>
									<h3>NASTAV E-SHOP</h3>
									<div className="text">Nastav si základní parametry e-shopu a spusť prodej.</div>
								</div>
							</div>
						</Col>
						<Col>
							<div className="step-to-success step-3">
								<div className="image">
									<div className="inner">
										<div className="number">1</div>
										<div className="icon">
											<BsCashCoin/>
										</div>
									</div>
								</div>
								<div>
									<h3>PRODÁVEJ</h3>
									<div className="text">Navrhni na nakonfiguruj své produkty</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</section>

			<section className="py-4">
				<Container>
					<h2>Editor</h2>
					<p>
						V našem editoru si jednoduše vytvoříš svůj vlastní design. Zvolíš typ produktu (hrnek, tričko, termoláhev, ...), barvu,
						nahraješ svůj obrázek a cenu, za kterou chceš produkt prodávat.
					</p>

					<h2>E-shop</h2>
					<p>
						Pro svůj e-shop si vybereš barvy, druh písma a nahraješ vlastní logo. Pokud budeš chtít, můžeš si objednat i vlastní doménu.
						To je vše, hned můžeš začít prodávat.
					</p>

					<h2>Prodej</h2>
					<p>
						Z každého prodaného kusu dostaneš předem dohodnutou část ceny. Jelikož každý zákazník na internetu má právo na vrácení zboží
						do 14 dnů bez udání důvodu
					</p>
				</Container>
			</section>

			<footer className="py-4">
				<Container>&copy; Merch Master 2026</Container>
			</footer>
		</div>
	);
}
