<?php

namespace App\Providers;

use App\Interface\AccountInterface;
use App\Interface\AuthInterface;
use App\Interface\BillInterface;
use App\Interface\DashBoardInterface;
use App\Interface\MemberInterface;
use App\Interface\MerchantInterface;
use App\Interface\PaypalInterface;
use App\Interface\PortalUserInterface;
use App\Interface\RolePermissionInterface;
use App\Interface\StripeInterface;
use App\Interface\StripInterface;
use App\Interface\TransactionInterface;
use App\Interface\UserInterface;
use App\Repository\AccountRepository;
use App\Repository\AuthRepository;
use App\Repository\BillRepository;
use App\Repository\DashBoardRepository;
use App\Repository\MemberRepository;
use App\Repository\MerchantRepository;
use App\Repository\PaypalRepository;
use App\Repository\PortalUserRepository;
use App\Repository\RolePermissionRepository;
use App\Repository\StripeRepository;
use App\Repository\TransactionRepository;
use App\Repository\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(AuthInterface::class, AuthRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(RolePermissionInterface::class, RolePermissionRepository::class);
        $this->app->bind(MerchantInterface::class, MerchantRepository::class);
        $this->app->bind(DashBoardInterface::class, DashBoardRepository::class);
        $this->app->bind(MemberInterface::class, MemberRepository::class);
        $this->app->bind(BillInterface::class, BillRepository::class);
        $this->app->bind(PortalUserInterface::class, PortalUserRepository::class);
        $this->app->bind(AccountInterface::class, AccountRepository::class);

        $this->app->bind(StripeInterface::class, StripeRepository::class);
        $this->app->bind(PaypalInterface::class, PaypalRepository::class);
        $this->app->bind(TransactionInterface::class, TransactionRepository::class);
    }
}
