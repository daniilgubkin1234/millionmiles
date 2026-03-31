from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    database_url: str
    admin_token: str = "local-admin-token"
    scraper_base_url: str = "https://car.encar.com/"
    scraper_list_url_template: str = (
        'https://car.encar.com/list/car?page={page}&search=%7B%22type%22%3A%22car%22%2C'
        '%22action%22%3A%22%28And.Hidden.N._.CarType.A.%29%22%2C%22toggle%22%3A%7B%7D%2C'
        '%22layer%22%3A%22%22%2C%22sort%22%3A%22MobileModifiedDate%22%7D'
    )
    scraper_max_cars: int = 36
    scraper_max_pages: int = 5
    scraper_headless: bool = True
    scheduler_run_on_start: bool = True
    scheduler_interval_hours: int = 24
    allowed_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [x.strip() for x in self.allowed_origins.split(",") if x.strip()]


settings = Settings()
