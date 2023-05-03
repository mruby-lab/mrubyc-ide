FROM ruby:3.2.2

RUN gem install sinatra webrick

WORKDIR /root/data
COPY app .

EXPOSE 4567

CMD ["ruby", "main.rb"]

