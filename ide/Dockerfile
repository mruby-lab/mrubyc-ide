FROM ruby:2.7

WORKDIR /root

RUN apt update -qq 

COPY app .

RUN bundle install

EXPOSE 4567

CMD ["ruby", "main.rb"]

