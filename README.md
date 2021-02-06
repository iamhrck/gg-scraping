## Golf Goya Scraping

Search Reservable Time

![system](./images/GGScraping.png)

### Tips

#### docker

```cmd
# --cap-add=SYS_ADMIN をつけないと権限の関係でchromeを起動できない
docker run --name gcp-cf -itd --cap-add=SYS_ADMIN  -p 8080:8080 -v %cd%:/app/gcp-cf gcp-cf
```

#### Cloud Functions

```bash
functions-framework --target=main
```
